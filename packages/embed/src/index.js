import { embedConfigurationURL, embedTelemetryURL, servicingPlanURL } from './urlBuilder';
import { error, log, warn } from './logger';
import fetchJSON from './fetchJSON';
import loadAsset from './loadAsset';
import setup from './setups/index';

const MAX_VERSION_REDIRECTIONS = 10;

function execRedirectRules(bot, redirects, version) {
  const featurePattern = /^feature:(.+)/;

  for (let [rule, redirectVersion] of redirects) {
    const featureMatch = featurePattern.exec(rule);
    let found;

    if (rule === '*') {
      found = true;
    } else if (featureMatch) {
      found = bot.features.includes(featureMatch[1]);
    } else {
      warn(`Version "${ version }" has an invalid rule "${ rule }", skipping.`);

      continue;
    }

    if (found) {
      return redirectVersion;
    }
  }
}

function findService(servicingPlan, bot, requestedVersion = 'default') {
  const traversedVersions = [];
  const logs = [];
  let publicOnly = true;
  const { versions } = servicingPlan;

  if (!versions['default']) {
    throw new Error(`There is no default version specified in the servicing plan.`);
  }

  for (let hop = MAX_VERSION_REDIRECTIONS; hop >= 0; hop--) {
    let service = versions[requestedVersion];

    traversedVersions.push(requestedVersion);

    if (
      !service
      || (publicOnly && service.private)
    ) {
      warn(`There is no version "${ requestedVersion }" or it is marked as private, falling back to "default".`);

      requestedVersion = 'default';
      publicOnly = true;

      continue;
    }

    const { redirects } = service || {};

    if (redirects) {
      logs.push(`Executing redirection rules of version "${ requestedVersion }".`);

      const actualVersion = execRedirectRules(bot, redirects, requestedVersion) || {};

      if (actualVersion) {
        requestedVersion = actualVersion;
        publicOnly = false;
      } else {
        warn(`Version "${ requestedVersion }" did not have a fallback plan, falling back to default version.`);

        requestedVersion = 'default';
        publicOnly = true;
      }

      continue;
    }

    log([
      'Selecting version ',
      traversedVersions
        .map(version => typeof version === 'undefined' ? '<undefined>' : `"${ version }"`)
        .join(' -> '),
      '.'
    ].join(''));

    return {
      service,
      version: requestedVersion
    };
  }

  throw new Error(`Maximum version redirections exceeded, probably problem with our servicing plan.`);
}

const AZURE_EFFECTIVE_LOCALE_PATTERN = /^([A-Za-z]{2})\.([A-Za-z]{2})$/;

function normalizeLanguage(language) {
  const match = AZURE_EFFECTIVE_LOCALE_PATTERN.exec(language);

  if (match) {
    return `${ match[1] }-${ match[2].toUpperCase() }`;
  } else {
    return language;
  }
}

function parseParams(search) {
  const params = new URLSearchParams(search);

  const botId = params.get('b') || undefined;
  const language = normalizeLanguage(params.get('l') || navigator.language);
  const token = params.get('t') || undefined;
  const userId = params.get('userid') || undefined;
  const username = params.get('username') || undefined;
  const version = params.get('v') || undefined;

  const secret = token ? undefined : params.get('s') || undefined;

  return {
    botId,
    language,
    secret,
    token,
    userId,
    username,
    version
  };
}

async function main() {
  const params = parseParams(location.search);
  const { botId, secret, token, version } = params;

  if (!secret && !token) {
    throw new Error(`You must specify either secret or token.`);
  }

  const [bot, servicingPlan] = await Promise.all([
    fetchJSON(
      embedConfigurationURL(botId, { secret, token, userId: params.userId }),
      { credentials: 'include' }
    ).catch(() => Promise.reject('Failed to fetch bot configuration.')),
    fetchJSON(
      servicingPlanURL()
    ).catch(() => Promise.reject(`Failed to fetch servicing plan.`))
  ]);

  const {
    service: {
      assets,
      deprecation,
      versionFamily
    }
  } = findService(servicingPlan, bot, version);

  assets && await Promise.all(assets.map(loadAsset));

  deprecation && warn(deprecation);

  const { version: actualVersion } = await setup(versionFamily, bot, params);
  const dataPoints = {
    [`actualversion:${ actualVersion }`]: 1,
    [`expectversion:${ (version || '').substr(0, 10) }`]: version,
    [`userid:${ bot.userIdSource }`]: 1,
    speech: bot.speech,
    websocket: bot.webSocket
  };

  await fetch(
    embedTelemetryURL(
      botId,
      { secret, token },
      Object.keys(dataPoints).filter(name => dataPoints[name])
    ),
    {
      mode: 'no-cors'
    }
  ).then(res => res.text());
}

main().catch(({ stack = '' }) => error(['Unhandled exception caught when loading.', '', ...stack.split('\n')].join('\n')));

import { Attachment, CardAction, HeroCard, Thumbnail, CardImage } from 'botframework-directlinejs';
import { Action, AdaptiveCard, CardElement, Column, ColumnSet, Container, Image, OpenUrlAction, Size, SubmitAction, TextBlock, TextSize, TextWeight } from "adaptivecards";
import { BotFrameworkCardAction } from './AdaptiveCardContainer';

export class AdaptiveCardBuilder {
    private container: Container;
    public card: AdaptiveCard;

    constructor() {
        this.card = new AdaptiveCard();

        this.container = new Container();
        this.card.addItem(this.container);
    }

    addColumnSet(sizes: number[], container?: Container) {
        container = container || this.container;
        const columnSet = new ColumnSet();
        container.addItem(columnSet);
        const columns = sizes.map(size => {
            const column = new Column();
            column.width = size;
            columnSet.addColumn(column);
            return column;
        })
        return columns;
    }

    addItems(cardElements: CardElement[], container?: Container) {
        container = container || this.container;
        cardElements.forEach(cardElement => container.addItem(cardElement));
    }

    addTextBlock(text: string, template: Partial<TextBlock>, container?: Container) {
        container = container || this.container;
        if (typeof text !== 'undefined') {
            const textblock = new TextBlock();
            for (let prop in template) {
                (textblock as any)[prop] = (template as any)[prop];
            }
            textblock.text = text;
            container.addItem(textblock);
        }
    }

    addButtons(buttons: CardAction[]) {
        if (buttons) {
            buttons.forEach(button => {
                var action = AdaptiveCardBuilder.convertCardAction(button);
                this.card.addAction(action);
            });
        }
    }

    private static convertCardAction(cardAction: CardAction) {
        let action: Action;
        if (cardAction.type === 'imBack' || cardAction.type === 'postBack') {
            const botFrameworkCardAction: BotFrameworkCardAction = { __isBotFrameworkCardAction: true, ...cardAction };
            action = new SubmitAction();
            (action as SubmitAction).data = botFrameworkCardAction;
        } else {
            action = new OpenUrlAction();
            (action as OpenUrlAction).url = cardAction.type === 'call' ? 'tel:' + cardAction.value : cardAction.value;
        }
        action.title = cardAction.title;
        return action;
    }

    addCommon(content: ICommonContent) {
        this.addTextBlock(content.title, { size: TextSize.Medium, weight: TextWeight.Bolder });
        this.addTextBlock(content.subtitle, { isSubtle: true, wrap: true });
        this.addTextBlock(content.text, { wrap: true });
        this.addButtons(content.buttons);
    }

    addImage(image: CardImage, container?: Container) {
        container = container || this.container;
        var img = new Image();
        img.url = image.url;
        img.size = Size.Stretch;
        if (image.tap) {
            img.selectAction = AdaptiveCardBuilder.convertCardAction(image.tap);
        }
        container.addItem(img);
    }

}

export interface ICommonContent {
    title?: string,
    subtitle?: string,
    text?: string,
    buttons?: CardAction[]
}

export const buildCommonCard = (content: ICommonContent): AdaptiveCard => {
    if (!content) return null;

    const cardBuilder = new AdaptiveCardBuilder();
    cardBuilder.addCommon(content)
    return cardBuilder.card;
};

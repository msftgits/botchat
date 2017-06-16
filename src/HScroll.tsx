import * as React from 'react';
import { konsole } from './Chat';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

export interface HScrollProps {
    scrollUnit?: 'page' | 'item'; // defaults to page
    prevSvgPathData: string;
    nextSvgPathData: string;
}

export class HScroll extends React.Component<HScrollProps, {}> {
    private prevButton: HTMLButtonElement;
    private nextButton: HTMLButtonElement;
    private scrollDiv: HTMLDivElement;
    private animateDiv: HTMLDivElement;

    private scrollStartTimer: number;
    private scrollSyncTimer: number;
    private scrollDurationTimer: number;
    private currentCardIndex: number;

    private scrollSubscription: Subscription;
    private clickSubscription: Subscription;

    constructor(props: HScrollProps) {
        super(props);
        this.currentCardIndex = 0;
    }

    private clearScrollTimers() {
        clearInterval(this.scrollStartTimer);
        clearInterval(this.scrollSyncTimer);
        clearTimeout(this.scrollDurationTimer);

        document.body.removeChild(this.animateDiv);

        this.animateDiv = null;
        this.scrollStartTimer = null;
        this.scrollSyncTimer = null;
        this.scrollDurationTimer = null;
    }

    public updateScrollButtons() {
        let ul = this.scrollDiv.querySelector('ul') as HTMLElement;
        this.prevButton.disabled = !this.scrollDiv || this.scrollDiv.scrollLeft <= 0 || this.currentCardIndex == 0;
        this.nextButton.disabled = !this.scrollDiv || this.scrollDiv.scrollLeft >= this.scrollDiv.scrollWidth - this.scrollDiv.offsetWidth ||
                                   ul.childElementCount - 1 ==  this.currentCardIndex;
    }

    componentDidMount() {
        this.scrollDiv.style.marginBottom = -(this.scrollDiv.offsetHeight - this.scrollDiv.clientHeight) + 'px';

        this.scrollSubscription = Observable.fromEvent<UIEvent>(this.scrollDiv, 'scroll').subscribe(_ => {
            this.updateScrollButtons();
        });

        this.clickSubscription = Observable.merge(
            Observable.fromEvent<UIEvent>(this.prevButton, 'click').map(_ => -1),
            Observable.fromEvent<UIEvent>(this.nextButton, 'click').map(_ => 1)
        ).subscribe(delta => {
            this.scrollBy(delta);
        });

        this.updateScrollButtons();
    }

    componentDidUpdate() {
        this.scrollDiv.scrollLeft = 0;
        this.updateScrollButtons();
    }

    componentWillUnmount() {
        this.scrollSubscription.unsubscribe();
        this.clickSubscription.unsubscribe();
    }

    private scrollAmount(direction: number) {
        if (this.props.scrollUnit == 'item') {
            let ret = 0;
            let ul = this.scrollDiv.querySelector('ul') as HTMLElement;
            if (ul.childElementCount > this.currentCardIndex && this.currentCardIndex >= 0) {
                let li = ul.children[this.currentCardIndex] as HTMLElement;
                ret = li.scrollWidth;
                var newIndex = this.currentCardIndex + direction;
                if (newIndex >= 0 && newIndex < ul.childElementCount) {
                    this.currentCardIndex = newIndex;
                }
            }
 
            return direction * ret;
        } else {
            // TODO: use a good page size. This can be improved by finding the next clipped item.
            return direction * (this.scrollDiv.offsetWidth - 70);
        }
    }

    private scrollBy(direction: number) {

        let easingClassName = 'wc-animate-scroll';

        //cancel existing animation when clicking fast
        if (this.animateDiv) {
            easingClassName = 'wc-animate-scroll-rapid';
            this.clearScrollTimers();
        }

        const unit = this.scrollAmount(direction);
        const scrollLeft = this.scrollDiv.scrollLeft;
        let dest = scrollLeft + unit;

        //don't exceed boundaries
        dest = Math.max(dest, 0);
        dest = Math.min(dest, this.scrollDiv.scrollWidth - this.scrollDiv.offsetWidth);

        if (scrollLeft == dest) return;

        //use proper easing curve when distance is small
        if (Math.abs(dest - scrollLeft) < 60) {
            easingClassName = 'wc-animate-scroll-near';
        }

        this.animateDiv = document.createElement('div');
        this.animateDiv.className = easingClassName;
        this.animateDiv.style.left = scrollLeft + 'px';
        document.body.appendChild(this.animateDiv);

        //capture ComputedStyle every millisecond
        this.scrollSyncTimer = window.setInterval(() => {
            const num = parseFloat(getComputedStyle(this.animateDiv).left);
            this.scrollDiv.scrollLeft = num;
        }, 1);

        //don't let the browser optimize the setting of 'this.animateDiv.style.left' - we need this to change values to trigger the CSS animation
        //we accomplish this by calling 'this.animateDiv.style.left' off this thread, using setTimeout
        this.scrollStartTimer = window.setTimeout(() => {
            this.animateDiv.style.left = dest + 'px';

            let duration = 1000 * parseFloat(getComputedStyle(this.animateDiv).transitionDuration);
            if (duration) {
                //slightly longer that the CSS time so we don't cut it off prematurely
                duration += 50;

                //stop capturing
                this.scrollDurationTimer = window.setTimeout(() => this.clearScrollTimers(), duration);
            } else {
                this.clearScrollTimers();
            }
        }, 1);
    }

    render() {
        return (
            <div>
                <button ref={ button => this.prevButton = button } className="scroll previous" disabled>
                    <svg>
                        <path d={ this.props.prevSvgPathData }/>
                    </svg>
                </button>
                <div className="wc-hscroll-outer">
                    <div className="wc-hscroll" ref={ div => this.scrollDiv = div }>
                        { this.props.children }
                    </div>
                </div>
                <button ref={ button => this.nextButton = button } className="scroll next" disabled>
                    <svg>
                        <path d={ this.props.nextSvgPathData }/>
                    </svg>
                </button>
            </div >
        )
    }
}

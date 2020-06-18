import { action } from 'mobx';

type DndElement = {
  element: HTMLElement;
  height: number;
};

type DndConfig = {
  title: string;
  id: string;
  children: string;
};

type Options = {
  id: string;
  allowParenting?: boolean;
  add?(to: any, item: any): void;
  accepts?: Array<{ id: string; parse?: (element: any) => any }>;
  acceptsSelf?: boolean;
  allowHorizontalMove?: boolean;
};

export class Dnd {
  _rootElement: HTMLDivElement = null as any;

  static dragId?: string;
  static dragItem?: any;
  static dragItemParent?: any[];
  static height = 0;
  static dragging?: boolean = false;
  static dragElement?: HTMLDivElement;
  static lastElement?: HTMLDivElement;
  static position?: 'top' | 'bottom' | 'middle';
  static overRoots: HTMLDivElement[] = [];

  splitColor = '#444';
  outlineStyle = '2px dotted #ccc';

  static avatar?: HTMLDivElement;
  static overItem?: any;
  static overItemParent?: any;
  static overItemElement?: HTMLDivElement;
  static handlerPressed = false;

  options: Options;

  // preventions
  static lastClick = Date.now();
  static startPosition = 0;
  static mouseMoved = false;

  handlerProps = {
    onMouseOver: (e: React.MouseEvent<HTMLDivElement>) => {
      if (Dnd.dragging == false) {
        e.currentTarget.style.cursor = 'grab';
      }
    },
    onMouseOut: (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.cursor = '';
    },
    onMouseDown: () => {
      Dnd.handlerPressed = true;
    }
  };

  // CONSTRUCTOR

  constructor(options: Options = { id: 'dnd' }) {
    if (options.acceptsSelf !== false) {
      if (options.accepts == null) {
        options.accepts = [];
      }
      options.accepts.push({ id: options.id });
    }
    this.options = options;
  }

  get rootElement() {
    if (this._rootElement == null) {
      this._rootElement = Dnd.dragElement as HTMLDivElement;
      while (
        this._rootElement != null &&
        this._rootElement.getAttribute('data-dnd') !== 'container'
      ) {
        this._rootElement = this._rootElement.parentNode as HTMLDivElement;
      }
    }
    return this._rootElement;
  }

  overRootElement(el: HTMLDivElement): HTMLDivElement | null {
    while (el != null && el.getAttribute('data-dnd') !== 'container') {
      el = el.parentNode as HTMLDivElement;
    }
    Dnd.overRoots.push(el);
    return el;
  }

  commit = () => {
    // CLEAR

    Dnd.dragging = false;
    Dnd.handlerPressed = false;
    this.rootElement.classList.remove('animated');

    // IF WE DID NOT MOVE THE MOUSE WE STOP

    if (Dnd.mouseMoved == false) {
      this.cleanup();
    }
    Dnd.mouseMoved = false;

    // WE REPLACE THE ELEMENT, OR WE CANCEL OPERATION

    if (Dnd.overItemElement != null) {
      // FINAL ANIMATION
      if (Dnd.avatar != null) {
        Dnd.avatar.style.transition = '0.2s ease-in-out';
        const bounds = Dnd.overItemElement!.getBoundingClientRect();

        let top = 0;
        if (Dnd.position === 'bottom') {
          top = bounds.top + Dnd.height;
        } else {
          top = bounds.top;
        }

        Dnd.avatar.style.top = top + 'px';
        Dnd.avatar.style.left = bounds.left + 'px';
      }

      // WHEN ANIMATION FNISHES DROP

      const { dragItemParent, dragItem } = Dnd;
      const { overItemParent, position, overItem } = Dnd;

      setTimeout(
        () => {
          if (overItem == null) {
            return;
          }

          // REPLACE IN ORIGINAL ARRAY

          action(() => {
            // remove from original position
            if (dragItemParent) {
              const fromIndex = dragItemParent!.findIndex(e => e === dragItem);
              dragItemParent!.splice(fromIndex, 1);
            }

            if (Dnd.position === 'middle') {
              if (this.options.add == null) {
                throw new Error('If you allow parenting, you have to define the add function');
              }
              // add to item
              this.options.add(overItem, dragItem);
            } else {
              // add to the new position
              const toIndex =
                overItemParent.findIndex((e: any) => e === overItem) +
                (position === 'bottom' ? 1 : 0);
              overItemParent.splice(toIndex, 0, dragItem);
            }

            this.cleanup();
          })();
        },
        Dnd.avatar ? 250 : 0
      );
    } else {
      this.cleanup();
    }
  };

  props(item: any, owner: any[], handler = false) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    return {
      onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        if (this.options.accepts?.every(e => e.id !== Dnd.dragId)) {
          console.log(
            `Does not accept "${Dnd.dragId}", accept only "${this.options.accepts
              .map(a => a.id)
              .join(',  ')}"`
          );
          return;
        }

        Dnd.overItem = item;
        Dnd.overItemParent = owner;
        Dnd.overItemElement = e.currentTarget;
        Dnd.dragElement = e.currentTarget;

        this.rootElement.classList.add('animated');

        // more efficient for simple lists
        if (!this.options.allowParenting) {
          this.calculateBorders(e as any, e.currentTarget);
        }
      },
      onDrop: () => {
        // console.log('dropped');
        this.commit();
      },
      onMouseOver: (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (Dnd.dragging == false) {
          return;
        }

        if (this.options.accepts?.every(e => e.id !== Dnd.dragId)) {
          console.log(
            `Does not accept "${Dnd.dragId}", accept only "${this.options.accepts
              .map(a => a.id)
              .join(',  ')}"`
          );
          return;
        }

        const root = this.overRootElement(e.currentTarget);

        console.log(e.currentTarget.innerHTML);
        console.log(root?.id);
        console.log('Over ...' + root?.classList.contains('animated'));

        if (root && !root.classList.contains('animated')) {
          root.classList.add('animated');
        }

        Dnd.overItem = item;
        Dnd.overItemParent = owner;
        Dnd.overItemElement = e.currentTarget;

        // more efficient for simple lists
        if (!this.options.allowParenting) {
          this.calculateBorders(e as any, e.currentTarget);
        }
      },
      onMouseOut: () => {
        Dnd.overItem = undefined;
        Dnd.overItemParent = undefined;
        Dnd.overItemElement = undefined;
      },

      onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();

        Dnd.dragId = this.options.id;

        // PREVENT DOUBLE CLICKS

        if (Date.now() - Dnd.lastClick < 300) {
          Dnd.lastClick = Date.now();
          return;
        }
        Dnd.lastClick = Date.now();
        Dnd.startPosition = event.clientY;
        Dnd.mouseMoved = false;

        // WE MAY LIMIT TO HANDLERS WHICH HANDLE THEIR OWN MOUSE EVENTS

        if (handler && !Dnd.handlerPressed) {
          return;
        }

        // CREATE CLONE

        const avatar = event.currentTarget.cloneNode(true) as HTMLDivElement;
        avatar.style.width = event.currentTarget.offsetWidth + 'px';
        avatar.style.height = event.currentTarget.offsetHeight + 'px';

        let originalX = event.currentTarget.getBoundingClientRect().left;
        let shiftX = event.clientX - originalX;
        let shiftY = event.clientY - event.currentTarget.getBoundingClientRect().top;

        avatar.style.position = 'absolute';
        avatar.style.zIndex = '1000';
        avatar.style.left = originalX + 'px';
        avatar.style.pointerEvents = 'none';
        document.body.style.cursor = 'grabbing';

        Dnd.avatar = avatar;
        document.body.append(avatar);

        // MOUSE EVENTS FOR AVATAR

        const moveAt = (pageX: number, pageY: number) => {
          if (this.options.allowHorizontalMove) {
            Dnd.avatar!.style.left = pageX - shiftX + 'px';
          }
          Dnd.avatar!.style.top = pageY - shiftY + 'px';
        };

        const onMouseMove = (event: MouseEvent) => {
          moveAt(event.pageX, event.pageY);

          if (Math.abs(event.clientY - Dnd.startPosition) > 2) {
            Dnd.mouseMoved = true;
          }

          if (Dnd.overItemElement == null) {
            this.clear();
            return;
          }

          if (this.options.allowParenting) {
            this.calculateBorders(event, Dnd.overItemElement);
          }
        };

        const onMouseUp = (e: MouseEvent) => {
          e.stopPropagation();

          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          document.body.style.cursor = '';

          this.commit();
        };

        moveAt(event.pageX, event.pageY);

        // move the ball on mousemove
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        avatar.ondragstart = function () {
          return false;
        };

        Dnd.dragElement = event.currentTarget;
        Dnd.height = Dnd.dragElement?.offsetHeight || 0;
        Dnd.dragging = true;
        Dnd.dragItem = item;
        Dnd.dragItemParent = owner;

        Dnd.dragElement!.style.display = 'none';

        // add initial border
        if (Dnd.dragElement?.nextSibling) {
          Dnd.lastElement = Dnd.dragElement.nextSibling as HTMLDivElement;
          Dnd.lastElement.style.borderTop = `${Dnd.height}px solid ${this.splitColor}`;
        } else if (Dnd.dragElement?.previousSibling) {
          Dnd.lastElement = Dnd.dragElement.previousSibling as HTMLDivElement;
          Dnd.lastElement.style.borderBottom = `${Dnd.height}px solid ${this.splitColor}`;
        }

        window.requestAnimationFrame(() => {
          this.rootElement.classList.add('animated');
        });
      }
    };
  }

  // PRIVATE METHODS

  private calculateBorders(event: MouseEvent, child: HTMLDivElement) {
    const rect = child.getBoundingClientRect();
    const y = Math.floor(event.clientY - rect.top); //y position within the element.
    const height = child.clientHeight;
    const border = height < 10 ? height / 2 : 5;

    if (y < border) {
      if (!this.options.allowParenting || Dnd.position !== 'top') {
        // console.log('top');
        this.clear(child);
        child.style.borderTop = `${Dnd.height}px solid ${this.splitColor}`;
        Dnd.position = 'top';
      }
    } else if (y > height - border) {
      if (!this.options.allowParenting || Dnd.position !== 'bottom') {
        Dnd.position = 'bottom';
        if (child.nextSibling) {
          // console.log('bottom');
          this.clear(child.nextSibling);
          (child.nextSibling as HTMLDivElement).style.borderTop = `${Dnd.height}px solid ${this.splitColor}`;
        } else {
          this.clear(child);
          child.style.borderBottom = `${Dnd.height}px solid ${this.splitColor}`;
        }
      }
    } else if (this.options.allowParenting) {
      if (Dnd.position != 'middle') {
        this.clear(child);
        child.style.outline = this.outlineStyle;
        Dnd.position = 'middle';
      }
    }
  }

  clear(newElement?: any) {
    if (Dnd.lastElement && Dnd.lastElement.style) {
      Dnd.lastElement.style.borderWidth = '0px';
      Dnd.lastElement.style.outline = '0px';
    }
    if (newElement) {
      Dnd.lastElement = newElement;
    }
  }

  private cleanup() {
    if (document.body.childNodes[document.body.childNodes.length - 1] === Dnd.avatar) {
      document.body.removeChild(Dnd.avatar!);
    }
    Dnd.dragElement!.style.display = '';

    for (let over of Dnd.overRoots) {
      over.classList.remove('animated');
    }
    Dnd.overRoots = [];
    this.clear();
  }
}

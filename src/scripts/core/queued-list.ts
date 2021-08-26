// A naive implementation of double linked list

export interface ILinkedListItem<T> {
    next: ILinkedListItem<T> | null;
    prev: ILinkedListItem<T> | null;
    value: T;
}

export class QueuedList<T> {
    private head: ILinkedListItem<T> | null = null;
    private tail: ILinkedListItem<T> | null = null;

    add(item: T): ILinkedListItem<T> {
        const listItem: ILinkedListItem<T> = {
            next: null,
            prev: null,
            value: item
        };

        if (!this.head && !this.tail) {
            this.head = listItem;
            this.tail = this.head;
        } else if (this.tail) {
            const tmpTail = this.tail;
            this.tail.next = listItem;
            this.tail = listItem;
            listItem.prev = tmpTail;
        }

        return listItem;
    }

    remove(item: ILinkedListItem<T>) {
        const prevItem = item.prev;
        const nextItem = item.next;

        if (prevItem) {
            prevItem.next = item.next;
        }
        if (nextItem) {
            nextItem.prev = item.prev;
        }
        if (item === this.head) {
            this.head = item.next;
        }
        if (item === this.tail) {
            this.tail = item.prev;
        }
    }

    traverse(callback: (item: T) => void) {
        let listItem = this.head
        while (listItem) {
            callback(listItem.value);
            listItem = listItem.next;
        }
    }
}
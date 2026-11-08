export class RingBuffer<T> {
  private buffer: (T | undefined)[];
  private head = 0;
  private tail = 0;
  private size = 0;
  private capacity: number;
  private arrayCache: T[] | null = null;

  constructor(capacity: number) {
    this.validateCapacity(capacity);
    this.capacity = capacity;
    this.buffer = new Array<T | undefined>(capacity);
  }

  public push(item: T): void {
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;

    if (this.isFull()) {
      this.head = (this.head + 1) % this.capacity;
    } else {
      this.size++;
    }

    this.arrayCache = null;
  }

  public pop(): T | undefined {
    if (this.isEmpty()) return undefined;

    const item = this.buffer[this.head];
    this.buffer[this.head] = undefined;
    this.head = (this.head + 1) % this.capacity;
    this.size--;
    this.arrayCache = null;

    return item;
  }

  public clear(): void {
    this.buffer = new Array<T | undefined>(this.capacity);
    this.head = 0;
    this.tail = 0;
    this.size = 0;
    this.arrayCache = null;
  }

  public resize(capacity: number): void {
    this.validateCapacity(capacity);
    if (capacity === this.capacity) return;

    const retainedItems = this.toArray().slice(-capacity);
    this.capacity = capacity;
    this.buffer = new Array<T | undefined>(capacity);
    this.head = 0;
    this.tail = 0;
    this.size = 0;
    this.arrayCache = null;

    for (const item of retainedItems) {
      this.push(item);
    }
  }

  public toArray(): T[] {
    if (this.arrayCache !== null) return this.arrayCache;

    const items: T[] = [];
    for (let i = 0; i < this.size; i++) {
      const item = this.buffer[(this.head + i) % this.capacity];
      items.push(item as T);
    }

    this.arrayCache = items;
    return items;
  }

  public isEmpty(): boolean {
    return this.size === 0;
  }

  public isFull(): boolean {
    return this.size === this.capacity;
  }

  public getSize(): number {
    return this.size;
  }

  public getCapacity(): number {
    return this.capacity;
  }

  private validateCapacity(capacity: number): void {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error("Capacity must be a positive integer");
    }
  }
}

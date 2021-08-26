// Any async action is represented by a Task object
// Task runner is continously call update callback on each task
// in which developer implements his application logic

import { ILinkedListItem, QueuedList } from "./queued-list";

export interface ITask {
    stop(): void;
}

class Task<T> implements ITask {
    public lastTime: number = 0;

    constructor(
        public callback: (delta: number, context: T, task:ITask, runner: TaskRunner) => void, 
        public context: T,
        private runner: TaskRunner) {
    }

    stop(): void {
        this.runner.removeTask(this);
    }
}

export class TaskRunner {
    private tasksList: QueuedList<Task<any>> = new QueuedList();
    private tasksMap: Map<ITask, ILinkedListItem<Task<any>>> = new Map();

    addTask<T>(callback:(delta: number, context: T, task:ITask, runner: TaskRunner) => void, context: T): ITask {
        const task = new Task(callback, context, this);
        const item = this.tasksList.add(task);

        this.tasksMap.set(task, item);

        return task;
    }

    removeTask(task: ITask) {
        const item = this.tasksMap.get(task);
        if (item) {
            this.tasksMap.delete(task);
            this.tasksList.remove(item);
        }
    }

    update(time: number) {
        this.tasksList.traverse((task => {
            const delta = time - (task.lastTime||time);
            task.callback(delta, task.context, task, this);
            task.lastTime = time;
        }));
    }

    stopAll(): void {
        this.tasksList.traverse((task => task.stop()));
        this.tasksMap.clear();
    }
}
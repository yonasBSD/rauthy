export type TriggerIndex = 'navMain' | 'navSub' | 'navSubSub';

let _signals: any = $state({});

export function useTrigger() {
    return {
        set(idx: TriggerIndex, callback: (data?: any) => void) {
            _signals[idx] = callback;
        },
        trigger(idx: TriggerIndex, data?: any) {
            _signals[idx]?.(data);
        }
    }
}

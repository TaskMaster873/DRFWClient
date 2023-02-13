class FilterUtils {
    readonly ignoredElements: string[] = [
        'isActive',
        'role',
        'skills',
        'jobTitles'
    ];

    public filter<T>(objectList: T[], filter: string) : T[] {
        return objectList.filter((objectItem: T) => {
            let startWith = false;

            // @ts-ignore
            let keys: string[] = Object.keys(objectItem);

            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let value = objectItem[key];

                if(this.ignoredElements.includes(key) || (typeof(value) !== 'string' && typeof(value) !== 'number')) {
                    continue;
                }

                if (value.toString().toLowerCase().startsWith(filter.toLowerCase())) {
                    startWith = true;
                    break;
                }
            }

            return startWith;
        });
    }

}

export const Filter = new FilterUtils();
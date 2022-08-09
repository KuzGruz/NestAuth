function convertToSeconds(date: string): number {
    const regexp = /(\d+)(s|m|h|d)/g
    const entityMap = {
        's': 1,
        'm': 60,
        'h': 60 * 60,
        'd': 60 * 60 * 24

    }
    const [, num, entity] = regexp.exec(date)

    if (!num || !entityMap[entity]) {
        return 0
    }

    return +num * entityMap[entity]
}

export  {
    convertToSeconds
}

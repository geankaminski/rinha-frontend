const mergeJson = (data, newData) => {
    if (Array.isArray(data)) {
        return [...data, ...newData];
    } else if (typeof data === "object") {
        const mergedData = {};
        for (const key in data) {
            mergedData[key] = mergeJson(data[key], newData[key]);
        }
        return mergedData;
    } else {
        return data;
    }
}

const sliceJson = (data, start, end) => {
    if (Array.isArray(data)) {
        return data.slice(start, end);
    } else if (typeof data === "object") {
        const slicedData = {};
        for (const key in data) {
            slicedData[key] = sliceJson(data[key], start, end);
        }
        return slicedData;
    } else {
        return data;
    }
}

export { mergeJson, sliceJson }
const rc = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

export const uniqid = (str, length) => {
    if (length <= 0) {
        return str + rc();
    }

    return uniqid(str + rc(), length - 1);
};

export const generateId = () => uniqid('', 8);
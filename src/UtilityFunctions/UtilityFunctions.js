export const addFileTypeExtention = (file, name) => {

    let fileExtention = null;

    switch (file.type) {
        case 'image/png': 
            fileExtention = 'png'; 
            break;
        case 'image/jpeg':
            fileExtention = 'jpeg'; 
            break;
        case 'image/jpg':
            fileExtention = 'jpg'; 
            break;        
           
        default:
            throw new Error("Unknown file type ")
    }

    const namedFile = new File([file], name + '.' + fileExtention, {type: file.type});
    return namedFile
}

export const formatTrimDots = (str) => {
    // change multiple dots with a single one
    str = str.replace(/([.]+)/g, ".")
    // dismiss dot on the end of the string if any
    str = str.replace(/[.]$/, "")
    
    return str
}
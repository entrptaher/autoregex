// for more details about regex elements- http://www.rexegg.com/regex-quickstart.html
const regexElements = {
    //indexing with number to avoid string as much as possible, for efficiency.
    0 : '\\d', 1 : '\\D', 2 : '\\w', 3 : '\\W', 4 : '\\s', 5 : '\\S', 6 : '.', 7:'\\', //characters
    8 : '+', 9 : '*', 10 : '?',  13(count) {return `{${count}}`;},//quantifiers
    11 : '|', 12(ptrn) {return `(${this.ptrn})`;}, 13(serial) {return `\\${this.serial}`;}, // logic
};

function regex(first,middle,last){  //main regex object
    //must exist before desired
    this.firstPart = (first==='') ? '()':`(${first})`;
    //desired part
    this.middlePart = (middle==='') ? '()':`(${middle})`;
    //must exist after desired
    this.lastPart = (last==='') ? '()':`(${last})`;
    this.full = this.firstPart+this.middlePart+this.lastPart;
}

function analyzeSampleChar(char){
    if(char.charCodeAt(0) > 47 && char.charCodeAt(0) <58) return 0; //if sample have 0-9
    if(char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) return 2; //if sample have a capital letter
    if(char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123) return 2; //if sample have a small letter
    return -1; //if sample have a special char
}

function regexGen(sample){
    if(typeof(sample)=='string' && sample.length > 0){
        sample = sample.trim();
        sample = sample.split("");
        const rawRgx=[];
        let index;
        //replacing sample with regex elements, word by word
        for(var i=0;i<sample.length;++i){
            index = analyzeSampleChar(sample[i]);
            if(index===-1){rawRgx.push(`\\${sample[i]}`);continue;} //add to regex as it is
            rawRgx.push(regexElements[index]); //new regex element
        }
        //1st analysis
        for(let i = 1, l = 0;i<rawRgx.length;){
            if(rawRgx[l] !== rawRgx[i])l=i++;
            if(rawRgx[l]===rawRgx[i]){
                if(rawRgx[l+1]==='+' || rawRgx[l+1]==='*') rawRgx.splice(i,1);
                else {rawRgx[i]=regexElements[8];++i;}
            }
        }
        const sRawRgx= rawRgx.join('');
        return new regex('',sRawRgx,'');
    }
}

module.exports = regexGen

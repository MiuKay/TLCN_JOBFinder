import moment from 'moment';
import * as XLSX from 'xlsx/xlsx.mjs'
class CommonUtils {
    static getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error)
        })
    }
    // return time form time to now
    static formatDate(time) {
        let a = moment.unix(new Date().getTime() / 1000).format('DD/MM/YYYY')
        let b = moment.unix(time / 1000).format('DD/MM/YYYY')

        var start = moment(b, "DD/MM/YYYY");
        var end = moment(a, "DD/MM/YYYY");

        //Difference in number of days

        return (moment.duration(start.diff(end)).asDays())
    }
    static removeSpace(str) {
        str = str.trim()
        return str = str.replace(/\s+/g, ' ').trim()
    }
    static replaceCode(str) {
        str = this.removeSpace(str)
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư

        return str = str.replace(/\s/g, '-')
    }
    static exportExcel(data,nameSheet,nameFile){
        return new Promise((resolve, reject) => {
            let wb = XLSX.utils.book_new()
            let ws = XLSX.utils.json_to_sheet(data)
            XLSX.utils.book_append_sheet(wb,ws,nameSheet)
            XLSX.writeFile(wb,`${nameFile}.xlsx`)
            resolve('oke')
        })
    }
}

export default CommonUtils;

module.exports.parseDate = function parseDate(dateIn){
    let dd = String(dateIn.getDate()).padStart(2,'0');
    let mm = String(dateIn.getMonth() + 1).padStart(2,'0');
    let yyyy = dateIn.getFullYear();

    return [yyyy,mm,dd];
}
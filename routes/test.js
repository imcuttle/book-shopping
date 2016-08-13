/**
 * Created by Moyu on 16/8/9.
 */

var fs = require('fs')

fs.writeFile('/Users/baidu/WebstormProjects/book-shopping/public/messImages/12663.txt', "12345", function (err) {
    if(err) console.error(err);
})
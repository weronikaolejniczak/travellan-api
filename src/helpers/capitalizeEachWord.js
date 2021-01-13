const capitalizeEachWord = (name) => 
    name.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');

module.exports = capitalizeEachWord;

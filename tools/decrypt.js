const crypto = require("crypto")
const path = require("path")
const fs = require("fs")

var decrypt_key = ""

decrypt = (plugins) => {
    const i = plugins.slice(0,16)
    plugins = plugins.slice(16)
    const d = crypto.createDecipheriv("aes-256-ctr", decrypt_key, i)
    const r = Buffer.concat([d.update(plugins), d.final()])
    return r
}

findExt = (base, ext, files, result) => {
    files = files || fs.readdirSync(base)
    result = result || []
    files.forEach((file) => {
        var newbase = path.join(base, file)
        if (fs.statSync(newbase).isDirectory()) result = findExt(newbase, ext, fs.readdirSync(newbase), result)
        else if (file.substr(-1*(ext.length+1)) == '.' + ext) result.push(newbase)
    })
    return result
}

findAllEncrypted = () => {
    var encrypt = [
        { extension : 'OMORI' , real_extension : 'js'   , file_list : findExt(path.join(__dirname, '\\..\\'),'OMORI' )},
        { extension : 'KEL'   , real_extension : 'json' , file_list : findExt(path.join(__dirname, '\\..\\'),'KEL'   )},
        { extension : 'HERO'  , real_extension : 'yaml' , file_list : findExt(path.join(__dirname, '\\..\\'),'HERO'  )},
        { extension : 'AUBREY', real_extension : 'json' , file_list : findExt(path.join(__dirname, '\\..\\'),'AUBREY')},
        { extension : 'PLUTO' , real_extension : 'yaml' , file_list : findExt(path.join(__dirname, '\\..\\'),'PLUTO' )},
    ]
    fs.writeFileSync(path.join(__dirname, '\\encrypted.log.json'), JSON.stringify({encrypt}, null, 4))
    return encrypt
}

decryptAll = () => {
    let encryptedList = findAllEncrypted()
    encryptedList.forEach((encryptType) => {
        encryptType.file_list.forEach((filePath) => {
            console.log(filePath)
            let buff = fs.readFileSync(filePath)
            let res = decrypt(buff).toString()
            fs.writeFileSync(filePath+'.decipher.'+encryptType.real_extension, res)
        })
    })
}

if(decrypt_key === '') { console.log('Please extract decrypt key first!') }
else decryptAll()


//---Please retrieve this first-------------------------------------------------------

var decrypt_key = ""

//------------------------------------------------------------------------------------

const crypto = require("crypto")
const path = require("path")
const fs = require("fs")

var log_path = path.join(__dirname, '\\encryption_info.log.json')

decrypt = (data) => {
    var iv = data.slice(0,16)
    data = data.slice(16)
    var d = crypto.createDecipheriv("aes-256-ctr", decrypt_key, iv)
    return Buffer.concat([d.update(data), d.final()])
}

encrypt = (data, ivHex) => {
    var iv = Buffer.from(ivHex, 'hex')
    var e = crypto.createCipheriv("aes-256-ctr", decrypt_key, iv)
    return Buffer.concat([iv, e.update(data), e.final()])
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

fileListWithIVInfo = (filePathList) => {
    result = []
    for(let i=0; i<filePathList.length; i++){
        var buff = fs.readFileSync(filePathList[i])
        var iv = buff.slice(0,16)
        result.push({path : filePathList[i], iv : iv.toString('hex')})
    }
    return result
}

findAllEncrypted = () => {
    var encrypt = [
        { extension : 'OMORI' , real_extension : 'js'   , file_list : fileListWithIVInfo(findExt(path.join(__dirname, '\\..\\'),'OMORI' ))},
        { extension : 'KEL'   , real_extension : 'json' , file_list : fileListWithIVInfo(findExt(path.join(__dirname, '\\..\\'),'KEL'   ))},
        { extension : 'HERO'  , real_extension : 'yaml' , file_list : fileListWithIVInfo(findExt(path.join(__dirname, '\\..\\'),'HERO'  ))},
        { extension : 'AUBREY', real_extension : 'json' , file_list : fileListWithIVInfo(findExt(path.join(__dirname, '\\..\\'),'AUBREY'))},
        { extension : 'PLUTO' , real_extension : 'yaml' , file_list : fileListWithIVInfo(findExt(path.join(__dirname, '\\..\\'),'PLUTO' ))},
    ]
    return encrypt
}

decryptAll = () => {
    if(decrypt_key === '') { console.log('Please extract decrypt key first!'); return }

    console.log('Finding encrypted files...')
    var encryptedList = findAllEncrypted()
    fs.writeFileSync(log_path, JSON.stringify(encryptedList, null, 4))

    console.log('Decrypting...')
    encryptedList.forEach((encryptType) => {
        encryptType.file_list.forEach((fileInfo) => {
            var decryptedPath = fileInfo.path + '.decipher.' + encryptType.real_extension
            var buff = fs.readFileSync(fileInfo.path)
            var res = decrypt(buff).toString()
            fs.writeFileSync(decryptedPath, res)
        })
    })
    console.log('Done!')
}

encryptAndOverwriteAll = () => {
    if(decrypt_key === '') { console.log('Please extract decrypt key first!'); return }

    if(!fs.existsSync(log_path)) { console.log('Please decrypt first!'); return }
    var encryptedList = JSON.parse(fs.readFileSync(log_path))

    console.log('Encrypting...')
    encryptedList.forEach((encryptType) => {
        encryptType.file_list.forEach((fileInfo) => {
            var decryptedPath = fileInfo.path + '.decipher.' + encryptType.real_extension
            var buff = fs.readFileSync(decryptedPath)
            var res = encrypt(buff, fileInfo.iv)
            fs.writeFileSync(fileInfo.path, res)
        })
    })
    console.log('Done!')
}


decryptAll()

//Bonus:
//Exp: OMORI\data\Enemies.KEL.decipher.json "exp":[0-9]+, "exp":999999,
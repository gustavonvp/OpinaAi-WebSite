import {GoogleSpreadsheet} from 'google-spreadsheet'


import moment from 'moment'

const doc = new GoogleSpreadsheet(process.env.SHEET_DOC_ID)

const genCoupon = () => {
const code = parseInt(moment().format('YYMMDDHHmmssSSS')).toString(16).toUpperCase()
return code.substr(0,4) + '-' + code.substr(4,4) + '-' + code.substr(8,4)
}

const fromBase64 = value =>{
    const buff = new Buffer.from(value, 'base64');
    return buff.toString('ascii')
}

export default async(req,res) => {

    try {

        await doc.useServiceAccountAuth({
            client_email:process.env.SHEET_CLIENT_EMAIL,
            private_key: fromBase64(process.env.SHEET_PRIVATE_KEY)
        })
await doc.loadInfo()
const sheet = doc.sheetsByIndex[1];
const data = JSON.parse(req.body)


const sheetConfig = doc.sheetsByIndex[2]
await sheetConfig.loadCells('A2:B2')
      
        
const mostrarPromoçãoCell = sheetConfig.getCell(1,0);
const TextoCell = sheetConfig.getCell(1,1);

let Cupom = ''
let Promo = ''

if(mostrarPromoçãoCell.value === 'VERDADEIRO'){
    // TODO: gerar cupom

    Cupom = genCoupon()
    Promo = TextoCell.value
}

//Nome Email Whatsapp Cupom Promo

await sheet.addRow({
    Nome: data.Nome,
    Email: data.Email ,
    Whatsapp: data.Whatsapp,
    'Data Preenchimento': moment().format('DD/MM/YYYY, HH:mm:ss'),
    Nota: parseInt(data.Nota),
    Cupom,
    Promo,
})
res.end(JSON.stringify({
    showCoupom: Cupom !== '',
    Cupom,
    Promo
}))

}catch(err){
    console.log(err)
    res.end('error')
}

}
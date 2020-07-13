import  { GoogleSpreadsheet } from 'google-spreadsheet'


//import { fromBase64 } from '../../utils/base64'

import moment from 'moment'

/*const fromBase64 = (value) =>{
    const buff =  Buffer.from(value,'base64')
    return buff.toString('ascii')

}
*/
const doc = new GoogleSpreadsheet(process.env.SHEET_DOC_ID)

const genCupom = () => {
    const code = parseInt(moment().format('YYYYMMDDHHmmssSSS')).toString(16).toUpperCase()
    return code.substr(0,4) + '-' + code.substr(4,4) + '-' + code.substr(8,4)
}

export default async(req,res) => {

    try{ 
        await doc.useServiceAccountAuth({
            client_email: process.env.SHEET_CLIENT_EMAIL,
            private_key:process.env.SHEET_PRIVATE_KEY
        })
        await doc.loadInfo()
        const sheet = doc.sheetsByIndex[1]
        const data = JSON.parse(req.body)


        const sheetConfig = doc.sheetsByIndex[2]
        await sheetConfig.loadCells('A1:B4')
        
        const mostrarPomocaoCell = sheetConfig.getCell(2,0)
        const textoCell = sheetConfig.getCell(2,1)
        
        let Cupom = ''
        let Promo = ''

        if(mostrarPomocaoCell.value === 'VERDADEIRO'){
            // TODO: gerar cupom
            Cupom = genCupom()
            Promo = textoCell.value
        }

        //Nome:	Email:	Whatsapp:	Cupom:	Promo:
        await sheet.addRow({
            Nome: data.Nome,
            Email: data.Email,
            Whatsapp: data.Whatsapp,
            Nota: parseInt(data.Nota),
            DataDePreenchimento:moment().format('DD/MM/YYYY, HH:mm:ss'), // July 10th 2020, 1:56:33 pm,
            Cupom,
            Promo
        })    

        res.end(JSON.stringify({
            showCoupon: Cupom !== '',
            Cupom,
            Promo

        }))
        }catch(err){
            console.log(err)
            res.end('error')
        }

}
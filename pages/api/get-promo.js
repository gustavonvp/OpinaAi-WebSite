import  { GoogleSpreadsheet } from 'google-spreadsheet'

//import { fromBase64 } from '../../utils/base64'
 
const doc = new GoogleSpreadsheet(process.env.SHEET_DOC_ID)



export default async(req,res) => {
    
    try{ 
        await doc.useServiceAccountAuth({
            client_email: process.env.SHEET_CLIENT_EMAIL,
            private_key:process.env.SHEET_PRIVATE_KEY
        })
        await doc.loadInfo()
        
        
        const sheet = doc.sheetsByIndex[2]
        await sheet.loadCells('A1:B4')
        
        const mostrarPomocaoCell = sheet.getCell(2,0)
        const textoCell = sheet.getCell(2,1)
        
        res.end(JSON.stringify({
            showCoupon: mostrarPomocaoCell.value === 'VERDADEIRO',
            message:textoCell.value
         }))
       
        
        }catch(err){
            res.end(JSON.stringify({
                showCoupon:false ,
                message:''
             }))
        
        }
    
    
   
}
import {
    Injectable,
    HttpService,
    NotFoundException,
    NotImplementedException,
    BadRequestException
} from '@nestjs/common';
import { ObjToString } from '../../utils/optquery';

var { BACKOFFICE_API_PORT, CLIENT_IP } = process.env

var baseUrl = `http://${CLIENT_IP}:${BACKOFFICE_API_PORT}/api/v1`;

@Injectable()
export class PaymentMethodService {
    constructor(private http: HttpService) { }

    async getAll(query: any){
        var URL = `${baseUrl}/payments/method`

		if(query){
            const Query = ObjToString(query)
		    URL = `${URL}?${Query}`
        }
        
        try{
            const result = await this.http.get(URL).toPromise()
			return result.data.data
		}catch(error){
            return error.response.data
		}
    }

    async getById(id: string){
        var URL = `${baseUrl}/payments/method/${id}`
        try{
            const result = await this.http.get(URL).toPromise()
            return result.data.data
		}catch(error){
            return error.response.data
		}
    }
}

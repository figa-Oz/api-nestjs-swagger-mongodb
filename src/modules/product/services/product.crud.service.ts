import {
	Injectable,
	NotFoundException,
	NotImplementedException
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { IProduct } from '../interfaces/product.interface';
import { OptQuery } from 'src/utils/OptQuery';
import { IOrder } from 'src/modules/order/interfaces/order.interface';
import { ICoupon } from 'src/modules/coupon/interfaces/coupon.interface';
import { IContent } from 'src/modules/content/interfaces/content.interface';
import { StrToUnix } from 'src/utils/StringManipulation';
import { RatingService } from 'src/modules/rating/rating.service';
import { filterByReference, findDuplicate, groupBy, objToArray, randomIn } from 'src/utils/helper';
import { IComment } from 'src/modules/comment/interfaces/comment.interface';
import { User } from 'src/modules/user/user.decorator';

const ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class ProductCrudService {

	constructor(
		@InjectModel('Product') private readonly productModel: Model<IProduct>,
		@InjectModel('Order') private orderModel: Model<IOrder>,
		@InjectModel('Coupon') private couponModel: Model<ICoupon>,
		@InjectModel('Content') private contentModel: Model<IContent>,
		@InjectModel('Comment') private commentModel: Model<IComment>,
		private readonly ratingService: RatingService
    ) {}
    
    async findAll(options: OptQuery) {
		// return await this.productModel.find()
		const {
			offset,
			limit,
			sortby,
			sortval,
			fields,
			value,
			optFields,
			optVal
		} = options;

		const limits = Number(limit)
		const offsets = Number(offset == 0 ? offset : (offset - 1))
		const skip = offsets * limits
		const sortvals = (sortval == 'asc') ? 1 : -1
		var query: any
		var sort: object = {}
		var match: object = { [fields]: value }
		

		if(optFields){
			if(!fields){
				match = { [optFields]: optVal }
			}
			match = { [fields]: value, [optFields]: optVal }
		}
		
		if (sortby){
			sort = { [sortby]: sortvals }
		}else{
			sort = { 'updated_at': 'desc' }
		}

		query = await this.productModel.find(match).skip(skip).limit(limits).sort(sort)
		.populate('rating')
		.populate({
			path: 'created_by',
			select: {_id:1, name:1, phone_number:1}
		})
		.populate({
			path: 'updated_by',
			select: {_id:1, name:1, phone_number:1}
		})
		.populate({
			path: 'topic',
			select: {_id:1, name:1, phone_number:1}
		})
		.populate({
			path: 'agent',
			select: {_id:1, name:1, phone_number:1}
		})
		.populate({
			path: 'tag',
			select: {_id:1, name:1}
		})

		//var result = new Array()
		/*
		for(let i in query){
			result[i] = query[i].toObject()

			if(query[i].rating){
				result[i].rating.average = await this.ratingService.percentage(query[i].rating).then(res => res.average)
			}
		}
		*/
		return query
	}

	async findById(id: string): Promise<IProduct> {
	 	let result
		try{
			result = await this.productModel.findOne({ _id: id }).populate('rating')
		}catch(error){
		    throw new NotFoundException(`Could nod find product with id ${id}`)
		}

		if(!result){
			throw new NotFoundException(`Could nod find product with id ${id}`)
		}

		return result;
	}

	async findBySlug(slug: string): Promise<IProduct> {
		let result
		try{
			result = await this.productModel.findOne({slug: slug})
	   	}catch(error){
		   throw new NotFoundException(`Could nod find product with slug ${slug}`)
	   	}

	   	if(!result){
		   throw new NotFoundException(`Could nod find product with slug ${slug}`)
	   	}

	   	return result
   }

	async delete(id: string): Promise<string> {
		try{
			// await this.productModel.findByIdAndRemove(id).exec();
			await this.productModel.findByIdAndUpdate(id, { visibility: 'draft' })
			return 'ok'
		}catch(err){
			throw new NotImplementedException('The product could not be deleted')
		}
	}

	async deleteMany(arrayId: any): Promise<string> {
		try {
			// await this.productModel.deleteMany({ _id: { $in: arrayId } });
			await this.productModel.updateMany({  _id: { $in: arrayId } }, { visibility: 'draft' })
			return 'ok';
		} catch (err) {
			throw new NotImplementedException('The product could not be deleted');
		}
	}

	async search(value: any): Promise<IProduct[]> {

		const result = await this.productModel.find({ $text: { $search: value.search } })

		if (!result) {
			throw new NotFoundException("Your search was not found")
		}

		return result
	}

	async insertMany(value: any, userId: any) {
		const arrayId = value.id
		const now = new Date()
		const copy = `COPY-${StrToUnix(now)}`
			
		var found = await this.productModel.find({ _id: { $in: arrayId } })
		for(let i in found){
			found[i]._id = new ObjectId()
			found[i].name = `${found[i].name}-${copy}`
			found[i].slug = `${found[i].slug}-${copy}`
			found[i].code = `${found[i].code}-${copy}`
			found[i].created_by = userId
			found[i].updated_by = null
		}
		
		try {
			return await this.productModel.insertMany(found);
		} catch (e) {
			throw new NotImplementedException(`The product could not be cloned`);
		}
	}

	async ProductCountList(options: OptQuery) {
		const {
			offset,
			limit,
			sortby,
			sortval,
			fields,
			value,
			optFields,
			optVal
		} = options;

		const limits = Number(limit)
		const offsets = Number(offset == 0 ? offset : (offset - 1))
		const skip = offsets * limits
		const sortvals = (sortval == 'asc') ? 1 : -1
		var sort: object = {}
		var match: object = { [fields]: value }

		if(optFields){
			if(!fields){
				match = { [optFields]: optVal }
			}
			match = { [fields]: value, [optFields]: optVal }
		}
		
		if (sortby){
			sort = { [sortby]: sortvals }
		}else{
			sort = { 'created': 'desc' }
		}

        const product = await this.productModel.find(match).skip(skip).limit(limits).sort(sort)
		.populate('rating')
		.populate({
			path: 'created_by',
			select: {_id:1, name:1, phone_number:1}
		})
		.populate({
			path: 'updated_by',
			select: {_id:1, name:1, phone_number:1}
		})
		.populate({
			path: 'topic',
			select: {_id:1, name:1, phone_number:1}
		})
		.populate({
			path: 'agent',
			select: {_id:1, name:1, phone_number:1}
		})
		.populate({
			path: 'tag',
			select: {_id:1, name:1}
		}).then(el => {
			const response = el.map(async(val) => {
				const comment = await this.commentModel.find({ product: val._id }).select(['_id', 'comment', 'reactions', 'user'])
				const reactions = new Array()
				comment.map(val => reactions.push(...val.reactions))

				const order = await this.orderModel.find({ "items.product_info": val._id}).select(['_id', 'user_info', 'status'])

				const userKeyList = groupBy(order, 'user_info')
				const userList = objToArray(userKeyList).map((val:any) => {
					console.log('order-status', val)
					const ttlStatusOrder = (status) => val.value.filter(res => res.status == status).length

					return {
						_id: val.key, 
						total_order: val.value.length,
						total_pending_order: ttlStatusOrder('PENDING'),
						total_unpaid_order: ttlStatusOrder('UNPAID'),
						total_paid_order: ttlStatusOrder('PAID'),
						// total_expired_order: ttlStatusOrder('EXPIRED'),
					}
				})

				return {
					product: val,
					count: {
						order: order.length,
						coupon: await this.couponModel.find({ "product_id": val._id}).countDocuments(),
						content: await this.contentModel.find({ "product._id": val._id }).countDocuments()
					},
					comments: {
						total_comment: comment.length,
						total_reaction: reactions.length,
						ref: comment.map(val => ({ _id: val._id, comment: val.comment, user_id: val.user }))
					},
					buyer: {
						total_buyer: userList.length,
						ref: userList,
					}
				}
			})

			return Promise.all(response)
		})

        return product
	}
	
	// async addRating(input: any, user_id: any) {
	// 	input.kind = "product"
	// 	input.rate.user_id = user_id
	// 	const ratingCheck = await this.ratingService.storeCheck(input)

	// 	if(!ratingCheck){
	// 		const query = await this.ratingService.push(input)

	// 		await this.productModel.findByIdAndUpdate(input.kind_id, {rating: query.rating_id})
	// 	}

	// 	return 'Success add rating'
	// }
	
	async bestSeller() {
		const result = await this.orderModel.find().then(arr => {
			return findDuplicate(arr, 'items', 'product_info', 5).map(product => ({product_id: product.key, total: product.value}))
		})

		return result
	}
	
	async onTrending(userID: string) {
		const order = await this.orderModel.find({user_info: userID})

		if(order.length < 1){
			return null
		}
		const objCount = findDuplicate(order, 'items', 'product_info').map(product => ({product_id: product.key, total: product.value}))
		return objCount
    }

	async onPaid(userID: string, orderStatus: string): Promise<any> {
		return await this.orderModel.find({user_info: userID, status: orderStatus}).then(order => {
			var products = []
			order.forEach(element => {
				products.push(...element.items.map(el => el.product_info))
			});

			return products
		})
    }
}

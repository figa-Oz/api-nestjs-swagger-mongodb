import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IProduct } from './interfaces/product.interface';
import { OptQuery } from '../utils/optquery';
import { prepareProduct } from '../utils';

import { CreateRatingDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
    constructor(@InjectModel('Product') private productModel: Model<IProduct>) {}

    async filter(options: OptQuery): Promise<IProduct> {
        const { offset, limit, fields, sortby, sortval, value } = options;

		const offsets = (offset == 0 ? offset : (offset - 1));
		const skip = offsets * limit;
		const sortvals = (sortval == 'asc') ? 1 : -1;

		if (sortby) {
			return await this.productModel
				.find({ $and: [ { [fields]: new RegExp(value, 'i') }, { visibility: 'publish' } ]})
				.skip(Number(skip))
				.limit(Number(limit))
				.sort({ [sortby]: sortvals })
				.populate('topic')
				.populate({ path: 'product_redirect', populate: { path: 'topic' }})
				.populate('agent')
				.exec();
		} else {
			return await this.productModel
				.find({ $and: [ { [fields]: new RegExp(value, 'i') }, { visibility: 'publish' } ]})
				.skip(Number(skip))
				.limit(Number(limit))
				.populate('topic')
				.populate({ path: 'product_redirect', populate: { path: 'topic' }})
				.populate('agent')
				.exec();
		}
	}
	
	async fetch(): Promise<IProduct[]> {
		const products = await this.productModel.find({})
			.populate('topic')
			.populate({ path: 'product_redirect', populate: { path: 'topic' }})
			.sort('-created_at');
		return products;
	}

    async search(query: any): Promise<IProduct> {
		const { product, topic } = query;
		if (topic) {
			const products = await this.productModel.find({}).populate({
				path: 'topic',
				match: { name: topic }
			}).exec();

			return products.map((product: any) => {
				if (product.topic.length > 0) {
					return prepareProduct(product);
				}
			});
		}
		const products = await this.productModel.find({ $and: [
			{ slug: new RegExp(product, 'i') }, 
			{ visibility: 'publish' }
		]}).populate('topic');
		return products.map((product: any) => prepareProduct(product));
	}

	async rating(id: string, rating: CreateRatingDTO): Promise<IProduct> {
		const checkId = await this.productModel.findById(id)

		if(!checkId){
			throw new NotFoundException('Product Id not found')
		}

		await this.productModel.findByIdAndUpdate(id, rating)

		return await this.productModel.findById(id)
	}
}

import {
	Controller,
	Get,
	Res,
	HttpStatus,
	Req,
	Param,
	Body,
	Post,
	Put,
	Delete,
	UseGuards
} from '@nestjs/common';

import {
	ApiTags,
	ApiOperation,
	ApiBearerAuth,
	ApiQuery
} from '@nestjs/swagger';

import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';

import { TopicService } from './topic.service';
import {
	CreateTopicDTO,
	UpdateTopicDTO,
	ArrayIdDTO,
	SearchDTO
} from './dto/topic.dto';
import { verify, toSignature, createOrder } from 'src/utils/helper';

var inRole = ["SUPERADMIN", "IT", "ADMIN"];

@ApiTags("Topics_BC")
@UseGuards(RolesGuard)
@Controller('topics')
export class TopicController {
	constructor(private readonly topicService: TopicService) { }

	/**
	 * @route   POST /api/v1/topics
	 * @desc    Create a new topic
	 * @access  Public
	 */

	@Post()
	@UseGuards(JwtGuard)
	@Roles(...inRole)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create new topic | Backofffice' })

	async create(@Res() res, @Body() createTopicDto: CreateTopicDTO) {
		const topic = await this.topicService.create(createTopicDto);

		return res.status(HttpStatus.CREATED).json({
			statusCode: HttpStatus.CREATED,
			message: 'The Topic has been successfully created.',
			data: topic
		});
	}

	/**
	 * @route   GET /api/v1/topics
	 * @desc    Get all topic
	 * @access  Public
	 */

	@Get()
	@ApiOperation({ summary: 'Get all topic | Free' })

	// Swagger Parameter [optional]
	@ApiQuery({
		name: 'sortval',
		required: false,
		explode: true,
		type: String,
		isArray: false
	})

	@ApiQuery({
		name: 'sortby',
		required: false,
		explode: true,
		type: String,
		isArray: false
	})

	@ApiQuery({
		name: 'value',
		required: false,
		explode: true,
		type: String,
		isArray: false
	})

	@ApiQuery({
		name: 'fields',
		required: false,
		explode: true,
		type: String,
		isArray: false
	})

	@ApiQuery({
		name: 'limit',
		required: false,
		explode: true,
		type: Number,
		isArray: false
	})

	@ApiQuery({
		name: 'offset',
		required: false,
		explode: true,
		type: Number,
		isArray: false
	})

	async findAll(@Req() req, @Res() res) {

		const topic = await this.topicService.findAll(req.query);
		return res.status(HttpStatus.OK).json({
			statusCode: HttpStatus.OK,
			message: `Success get topics`,
			total: topic.length,
			data: topic
		});
	}

	/**
	 * @route    Get /api/v1/topics/:id
	 * @desc     Get topic by ID
	 * @access   Public
	 */

	@Get(':id')
	@ApiOperation({ summary: 'Get topic by id' })

	async findById(@Param('id') id: string, @Res() res)  {
		const topic = await this.topicService.findById(id);
		return res.status(HttpStatus.OK).json({
			statusCode: HttpStatus.OK,
			message: `Success get topic by id ${id}`,
			data: topic
		});
	}

	/**
	 * @route   Put /api/v1/topics/:id
	 * @desc    Update topic by Id
	 * @access  Public
	 **/

	@Put(':id')
	@UseGuards(JwtGuard)
	@Roles(...inRole)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update topic by id | Backofffice' })

	async update(
		@Param('id') id: string,
		@Res() res,
		@Body() updateTopicDto: UpdateTopicDTO
	) {
		const topic = await this.topicService.update(id, updateTopicDto);
		return res.status(HttpStatus.OK).json({
			statusCode: HttpStatus.OK,
			message: 'The Topic has been successfully updated.',
			data: topic
		});
	}

	/**
	 * @route   Delete /api/v1/topics/:id
	 * @desc    Delete topic by ID
	 * @access  Public
	 **/

	@Delete(':id')
	@UseGuards(JwtGuard)
	@Roles(...inRole)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete topic | Backofffice' })

	async delete(@Param('id') id: string, @Res() res){
		const topic = await this.topicService.delete(id);

		if (topic == 'ok') {
			return res.status(HttpStatus.OK).json({
				statusCode: HttpStatus.OK,
				message: `Success remove topic by id ${id}`
			});
		}
	}

	/**
	 * @route   Delete /api/v1/topics/delete/multiple
	 * @desc    Delete topic by multiple ID
	 * @access  Public
	 **/

	@Delete('delete/multiple')
	@UseGuards(JwtGuard)
	@Roles(...inRole)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete multiple topic | Backofffice' })

	async deleteMany(@Res() res, @Body() arrayId: ArrayIdDTO) {
		const topic = await this.topicService.deleteMany(arrayId.id);
		if (topic == 'ok') {
			return res.status(HttpStatus.OK).json({
				statusCode: HttpStatus.OK,
				message: `Success remove topic by id in: [${arrayId.id}]`
			});
		}
	}

	/**
	 * @route   Post /api/v1/topics/find/search
	 * @desc    Search topic by name
	 * @access  Public
	 **/

	/**
	@Post('find/search')
	@UseGuards(JwtGuard)
	@Roles(...inRole)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Search and show' })

	async search(@Res() res, @Body() search: SearchDTO) {
		const result = await this.topicService.search(search);
		return res.status(HttpStatus.OK).json({
			statusCode: HttpStatus.OK,
			message: `Success search topic`,
			total: result.length,
			data: result
		});
	}
	*/

	/**
	 * @route   POST /api/v1/topics/multiple/clone
	 * @desc    Clone topics
	 * @access  Public
	 */

	@Post('multiple/clone')
	@UseGuards(JwtGuard)
	@Roles(...inRole)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Clone topics | Backofffice' })

	async clone(@Res() res, @Body() input: ArrayIdDTO) {

		const cloning = await this.topicService.insertMany(input)

		return res.status(HttpStatus.CREATED).json({
			statusCode: HttpStatus.CREATED,
			message: 'Has been successfully cloned the topic.',
			data: cloning
		});
	}

	/**
	 * @route    Get /api/v1/topics/list/count
	 * @desc     Get topic list & count
	 * @access   Public
	 */

	@Get('list/count')
	@UseGuards(JwtGuard)
	@Roles(...inRole)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get topic & count' })

	async listCount(@Res() res)  {
		const topic = await this.topicService.topicCountList();
		return res.status(HttpStatus.OK).json({
			statusCode: HttpStatus.OK,
			message: `Success get topics`,
			data: topic
		});
	}

	/**
	 * @route    Get /api/v1/topics/dana/signature
	 * @desc     Get topic list & count
	 * @access   Public
	 */

	@Post('dana/signature')
	@ApiOperation({ summary: 'Dana signature' })

	async signDana(@Res() res)  {
		// const data = {
		// 	'head': {
		// 		'version': '2.0',
		// 		'function': 'dana.oauth.auth.applyToken',
		// 		'clientId': '2020032642169039682633',
		// 		'clientSecret': 'be555206838b4f9f9d6baae30e21fd2e',
		// 		"reqTime":  new Date(),
		// 		"reqMsgId": "123124124124",
		// 		"reserve": "{}"
		// 	},
		// 	'body': {
		// 		"grantType": "AUTHORIZATION_CODE",
		// 		"authCode": "4b203fe6c11548bcabd8da5bb087a83b"
		// 	}
		// }

		// const result = signature(data)

		// const dec = verify(data, result)

		const newOrder = createOrder()

		// console.log('order', newOrder)
		return res.status(HttpStatus.OK).json({
			statusCode: HttpStatus.OK,
			message: `Success get topics`,
			data: newOrder
		});
	}
}

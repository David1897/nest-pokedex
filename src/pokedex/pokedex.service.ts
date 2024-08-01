import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokedexDto } from './dto/create-pokedex.dto';
import { UpdatePokedexDto } from './dto/update-pokedex.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokedex } from './entities/pokedex.entity';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokedexService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokedex.name)
    private readonly pokedexModel: Model<Pokedex>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('defaultlimit');
    // console.log({ DefaultLimit: configService.get<number>('defaultlimit') });
  }
  async create(createPokedexDto: CreatePokedexDto) {
    createPokedexDto.name = createPokedexDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokedexModel.create(createPokedexDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokedexModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1,
      })
      .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokedex;

    if (!isNaN(+term)) {
      pokemon = await this.pokedexModel.findOne({ no: term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokedexModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokedexModel.findOne({ name: term });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name or no ${term} not found`,
      );
    }

    return pokemon;
  }

  async update(term: string, updatePokedexDto: UpdatePokedexDto) {
    const pokemon = await this.findOne(term);
    if (updatePokedexDto.name)
      updatePokedexDto.name = updatePokedexDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokedexDto);

      return { ...pokemon.toJSON(), ...updatePokedexDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // const pokemon = await this.pokedexModel.findByIdAndDelete(id);

    const { deletedCount } = await this.pokedexModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`${id} was not found on the database`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs`,
    );
  }
}

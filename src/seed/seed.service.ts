import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokedex } from 'src/pokedex/entities/pokedex.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokedex.name) private readonly pokedexModel: Model<Pokedex>,
    private readonly http: AxiosAdapter,
  ) {}

  async excuteSeed() {
    await this.pokedexModel.deleteMany({});
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      // console.log({ name, no });
      pokemonToInsert.push({ name, no });
    });

    await this.pokedexModel.insertMany(pokemonToInsert);

    return 'Seed Executed';
  }
}

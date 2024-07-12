import { Module } from '@nestjs/common';
import { PokedexService } from './pokedex.service';
import { PokedexController } from './pokedex.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokedex, PokedexSchema } from './entities/pokedex.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pokedex.name, schema: PokedexSchema }]),
  ],
  controllers: [PokedexController],
  providers: [PokedexService],
})
export class PokedexModule {}

import { Module } from '@nestjs/common';
import { PokedexService } from './pokedex.service';
import { PokedexController } from './pokedex.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokedex, PokedexSchema } from './entities/pokedex.entity';
import { ConfigModule} from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pokedex.name, schema: PokedexSchema }]),
    ConfigModule,
  ],
  controllers: [PokedexController],
  providers: [PokedexService],
  exports: [MongooseModule],
})
export class PokedexModule {}

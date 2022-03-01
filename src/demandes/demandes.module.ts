import { Module } from '@nestjs/common';
import { DemandesService } from './demandes.service';
import { DemandesController } from './demandes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Demande, DemandeSchema } from 'src/models/demande.model';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { User, UserSchema } from 'src/models/user.model';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Demande.name, schema: DemandeSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET_KEY,
          signOptions: {
            expiresIn: '24h',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [DemandesController],

  providers: [DemandesService, JwtStrategy],
})
export class DemandesModule {}

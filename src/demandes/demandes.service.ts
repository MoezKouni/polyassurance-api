import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Demande, DemandeDocument } from 'src/models/demande.model';
import { CreateDemandeDto } from './dto/create-demande.dto';
import { UpdateDemandeDto } from './dto/update-demande.dto';

@Injectable()
export class DemandesService {
  constructor(
    @InjectModel(Demande.name) private damandeModel: Model<DemandeDocument>,
  ) {}

  async create(createDemandeDto: CreateDemandeDto, userId: any, files: any) {
    const newDemande = await new this.damandeModel({
      ...createDemandeDto,
      user: userId,
      documents: files.map((el: any) => el.path),
    });
    await newDemande.save();
    return newDemande;
  }

  findAll() {
    return this.damandeModel.find().populate('user', '-permissions -role');
  }

  findByUserId(userId: string) {
    return this.damandeModel
      .find({ user: userId })
      .populate('user', '-permissions -role');
  }

  findDemandeById(id: string) {
    return this.damandeModel
      .findById(id)
      .populate('user', '-permissions -role');
  }

  findRecentDemandes() {
    return this.damandeModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', '_id firstname lastname');
  }

  findOne(id: number) {
    return `This action returns a #${id} demande`;
  }

  update(id: number, updateDemandeDto: UpdateDemandeDto) {
    return `This action updates a #${id} demande`;
  }

  remove(id: number) {
    return `This action removes a #${id} demande`;
  }

  async changeStatus(id: string, data: any) {
    const demande = await this.damandeModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return demande;
  }
}

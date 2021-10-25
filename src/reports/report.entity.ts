import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reports')
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;
}

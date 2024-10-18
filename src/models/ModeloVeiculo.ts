import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";
import Montadora from "./Montadora";

@Entity()
class ModeloVeiculo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string; 

    @Column()
    valor_referencia!: number; 

    @Column()
    motorizacao!: number; 

    @Column()
    turbo!: boolean;
    
    @Column()
    automatico!: boolean;

    @ManyToOne(() => Montadora, montadora => montadora.modelos)
    montadora!: Montadora; 
}

export default ModeloVeiculo;

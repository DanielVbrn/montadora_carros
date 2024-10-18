import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import ModeloVeiculo from "./ModeloVeiculo";

@Entity()
class Montadora {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    nome!: string;

    @Column({ type: "varchar", length: 100 })
    pais!: string;

    @Column({ type: "int" })
    ano_fundacao!: number;

    @OneToMany(() => ModeloVeiculo, modeloVeiculo => modeloVeiculo.montadora)
    modelos!: ModeloVeiculo[]; 
}

export default Montadora;

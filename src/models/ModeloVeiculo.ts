import { PrimaryGeneratedColumn, Column, Entity } from "typeorm"

@Entity()

class ModeloVeiculo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string; 

    @Column()
    montadora_id!: number; 

    @Column()
    valor_referencia!: number; 

    @Column()
    motorizacao!: number; 

    @Column()
    turbo!: boolean;
    
    @Column()
    automatico!: boolean

}

export default ModeloVeiculo;
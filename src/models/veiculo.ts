import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
class Veiculo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    modelo_id!: string;

    @Column()
    name!: string;
    
    @Column()
    cor!: string;

    @Column()
    ano_fabricacao!: number;

    @Column()
    ano_modelo!: number;

    @Column()
    valor!: number;

    @Column()
    placa!: string;

    @Column({default:false})
    vendido!: boolean

}

export default Veiculo

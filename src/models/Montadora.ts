import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}

export default Montadora;

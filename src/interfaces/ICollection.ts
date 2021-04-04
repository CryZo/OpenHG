export default interface ICollection {
	Items: any[];

	Add(room: any): void;
	GetById(id: string): any;
}
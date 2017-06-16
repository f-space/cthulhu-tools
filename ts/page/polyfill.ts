export default function (): void {
	if (NodeList.prototype.forEach === undefined) {
		NodeList.prototype.forEach = function (this: NodeList, callbackfn: (value: Node, index: number, listObj: NodeList) => void, thisArg?: any): void {
			Array.prototype.forEach.call(this, callbackfn, thisArg);
		}
	}
}
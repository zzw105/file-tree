declare const getConfig: () => {
    ignore: string[];
    export: string;
};
declare const question: (question: string) => Promise<string>;
declare function readLine(question: string): Promise<string>;
export { getConfig, question, readLine };

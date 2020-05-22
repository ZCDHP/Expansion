export const enum Files {
    app = "app",
    vendor = "vendor",
};

const entires = {
    [Files.app]: "client.tsx",
};

const cacheGroups = {
    [Files.vendor]: {
        test: /[\\/]node_modules[\\/]/,
        name: Files.vendor,
        chunks: 'all'
    }
}

const Bundles = {
    entires,
    cacheGroups
};

export default Bundles;

import { Alert, Box, Grid, Pagination, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import {
    useGetCategoriesQuery,
    useGetProductsQuery,
} from "../../redux/apiSlice";
import { addToCart } from "../../redux/cartSlice";
import { addProducts } from "../../redux/productSlice";
import { AppDispatch } from "../../redux/store/configureStore";
import { useAppDispatch, useAppSelector } from "../../redux/store/hooks";
import { CategoryType, ProductType } from "../../types/productType";
import ProductCard from "../ProductCard";
import Suspense from "../Suspense";
import CartDrawer from "./CartDrawer";
import Options from "./Options";
import { ProductsStyles } from "./Products.styles";
import logo from "./logo.png";

interface ActualProductListProps {
    products: ProductType[];
    categories: CategoryType[];
    dispatch: AppDispatch;
}

const ProductCountPerPage = 20;
const getPageCount = (productsLength: number) => {
    return Math.ceil(productsLength / ProductCountPerPage);
};

const getSlice = (page: number, products: ProductType[]) => {
    const adjust = (page - 1) * ProductCountPerPage;
    return products.slice(adjust, page * ProductCountPerPage);
};

const ActualProductList = ({
    products,
    categories,
    dispatch,
}: ActualProductListProps) => {
    const [snackOpen, setSnackOpen] = useState(false);
    const [page, setPage] = useState(1);
    const pageCount = getPageCount(products.length);
    const productsSlice = getSlice(page, products);

    const handleChange = (
        _event: React.ChangeEvent<unknown>,
        value: number,
    ) => {
        setPage(value);
    };

    const handleAddToCart = (clickedItem: ProductType) => {
        setSnackOpen(true);
        dispatch(addToCart(clickedItem));
    };

    const handleClose = (
        _event: React.SyntheticEvent | Event,
        reason?: string,
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setSnackOpen(false);
    };

    return (
        <ProductsStyles data-testid="products">
            <CartDrawer setSnackOpen={setSnackOpen} dispatch={dispatch} />
            <Box pt={1} />
            <Options categories={categories} />
            <Box pt={3} pb={5} display={"flex"} justifyContent={"right"}>
                <Pagination
                    count={pageCount}
                    page={page}
                    onChange={handleChange}
                    color="secondary"
                />
            </Box>
            <Grid container spacing={3}>
                {productsSlice.map((product) => (
                    <Grid item key={product.id} xs={12} sm={4}>
                        <ProductCard
                            product={product}
                            handleAddToCart={handleAddToCart}
                        />
                    </Grid>
                ))}
            </Grid>
            <Snackbar
                open={snackOpen}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert severity="success" sx={{ width: "100%" }}>
                    Item added to cart
                </Alert>
            </Snackbar>
        </ProductsStyles>
    );
};

interface CategoryProductsProps {
    data: {
        products: ProductType[];
        categories: CategoryType[];
    };
}

const CategoryProducts = (props: CategoryProductsProps) => {
    // create tab for each product categories
    // filter categories with text or other
    const dispatch = useAppDispatch();
    const categoryProducts = useAppSelector((state) => state.product.products);
    const { categories, products } = props.data;
    // limited categories
    const categoriesSlice = categories.slice(0, 6);

    // onMount adding Products to the productSlice
    useEffect(() => {
        dispatch(addProducts(products));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ActualProductList
            products={categoryProducts}
            dispatch={dispatch}
            categories={categoriesSlice}
        />
    );
};

const ProductList = () => {
    const productsResult = useGetProductsQuery();
    const categoriesResult = useGetCategoriesQuery();

    const isSuccess = productsResult.isSuccess && categoriesResult.isSuccess;
    const isLoading = productsResult.isLoading || categoriesResult.isLoading;
    const isError = productsResult.isError || categoriesResult.isError;
    const error = productsResult.error || categoriesResult.error;
    let wrappedData;
    if (isSuccess) {
        wrappedData = {
            products: productsResult.data,
            categories: categoriesResult.data,
        };
    }

    let content = (
        <Suspense
            data={wrappedData}
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            error={error}
            Component={CategoryProducts}
        />
    );

    return (
        <section className="products-list">
            <Grid
                alignItems="center"
                justifyContent="center"
                style={{ textAlign: "center" }}
            >
                <img src={logo} alt="Logo" height={400} width={1100} />

                {content}
            </Grid>
        </section>
    );
};

export default ProductList;

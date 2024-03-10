export const LoadingSpinner = ({width = "24rem"}) => {
    return (
        <div className="loading-spinner">
            <img width={width} src="public/loading.gif" alt="Loading..." />
        </div>
    );
};
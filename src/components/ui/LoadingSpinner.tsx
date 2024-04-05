export const LoadingSpinner = ({width = "24rem"}) => {
    return (
        <div className="loading-spinner">
            <img width={width} src="/loading.gif" alt="Loading..." />
        </div>
    );
};
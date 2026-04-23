import { Helmet } from 'react-helmet-async';

export default function Meta({ title, description, keywords }) {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content="Minoxidile Shop" />
            <meta property="og:image" content="https://minoxidileshop.com/images/meta-logo.png" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content="https://minoxidileshop.com/images/meta-logo.png" />
        </Helmet>
    );
}

Meta.defaultProps = {
    title: 'Minoxidile | Premium E-commerce Experience',
    description: 'Discover curated products from the best brands. Premium quality, unbeatable prices, and a shopping experience unlike anything else.',
    keywords: 'minoxidil, beard care, electronics, buy electronics, cheap electronics, premium products, supplements'
};

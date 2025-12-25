
  // useEffect for generating dynamic meta tags
  useEffect(() => {
    if (articleData) {
      // Update the document title
      document.title = `${articleData.title} - IntelForgeeks`;
  
      // Update meta tags dynamically
      const updateMetaTag = (name, content) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = name;
          document.getElementsByTagName('head')[0].appendChild(meta);
        }
        meta.content = content;
      };
  
      // Update meta property tags dynamically
      const updateMetaProperty = (property, content) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.getElementsByTagName('head')[0].appendChild(meta);
        }
        meta.content = content;
      };
  
      // Standard meta tags
      updateMetaTag('description', articleData.smallDescription);
      updateMetaTag('viewport', 'width=device-width, initial-scale=1');
      updateMetaTag('robots', 'index, follow');
  
      // Open Graph meta tags
      updateMetaProperty('og:title', articleData.title);
      updateMetaProperty('og:description', articleData.smallDescription);
      updateMetaProperty('og:image', articleData.image ? urlForImage(articleData.image).url() : "/default-image.jpg");
      updateMetaProperty('og:type', 'article');
  
      // Twitter Card meta tags
      updateMetaProperty('twitter:card', 'summary_large_image');
      updateMetaProperty('twitter:title', articleData.title);
      updateMetaProperty('twitter:description', articleData.smallDescription);
      updateMetaProperty('twitter:image', articleData.image ? urlForImage(articleData.image).url() : "/default-image.jpg");
  
      // Additional tags as needed (e.g., author, publisher)
      updateMetaTag('author', 'IntelForgeeks');
      updateMetaTag('publisher', 'IntelForgeeks');
    }
  }, [articleData]);

  <Head>
  <title>
    {articleData
      ? `${articleData.title} - IntelForgeeks`
      : "IntelForgeeks"}
  </title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta
    name="description"
    content={articleData ? articleData.smallDescription : "At IntelForgeeks, we cover everything tech. From detailed tutorials and the latest tech news to essential roadmaps and innovative tools, we provide the resources you need to navigate the tech landscape."}
  />
  <meta name="robots" content="index, follow" />
  <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  <meta
    property="og:title"
    content={articleData ? articleData.title : "IntelForgeeks"}
  />
  <meta
    property="og:description"
    content={articleData ? articleData.smallDescription : "At IntelForgeeks, we cover everything tech. From detailed tutorials and the latest tech news to essential roadmaps and innovative tools, we provide the resources you need to navigate the tech landscape."}
  />
  <meta
    property="og:image"
    content={
      articleData && articleData.image
        ? urlForImage(articleData.image).url()
        : "/default-image.jpg"
    }
  />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content={articleData ? articleData.title : "IntelForgeeks"}
  />
  <meta
    name="twitter:description"
    content={articleData ? articleData.smallDescription : "At IntelForgeeks, we cover everything tech. From detailed tutorials and the latest tech news to essential roadmaps and innovative tools, we provide the resources you need to navigate the tech landscape."}
  />
  <meta
    name="twitter:image"
    content={
      articleData && articleData.image
        ? urlForImage(articleData.image).url()
        : "/default-image.jpg"
    }
  />
</Head>

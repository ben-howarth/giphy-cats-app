import { useState, useEffect } from 'react';

type Gif = {
  id: string,
  title: string,
  url: string
}

function GifPage(){
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [selectedGif, setSelectedGif] = useState<Gif | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const resultsPerPage = 25;

  useEffect(() => {
    async function fetchGifs(){
      try {
        // passing offset variable handles paging on the giphy endpoint
        const offset = currentPage * resultsPerPage;
        const apiKey = process.env.REACT_APP_GIPHY_API_KEY;
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q="cats dogs"&limit=25&offset=${offset}`
        );
        const data = await response.json();
        const gifData = data.data.map((gif: any) => ({
          id: gif.id,
          title: gif.title,
          url: gif.images.fixed_height.url,
        }));
        setGifs(gifData);
      } catch (error) {
        console.error('Error fetching GIFs:', error);
      }
    };

    fetchGifs();
  }, [currentPage]);

  function handleGifClick(gif: Gif){
    setSelectedGif(gif);
  };

  function closeDetailView(){
    setSelectedGif(null);
  };
  
  function handleNextPageClick(){
    setCurrentPage(currentPage+1);
  }

  function handlePreviousPageClick() {
    setCurrentPage(currentPage-1);
  }
  // the giphy api allows an offset between 0 and 4999, use these booleans to disable the button to prevent leaving this range 
  const previousPageDisabled: boolean = currentPage === 0;
  const nextPageDisabled: boolean = currentPage === Math.floor(4999/resultsPerPage);

  return (
    <div>
      <h1>Latest Cat and Dog Gifs!</h1>
      {selectedGif ? (
        <div>
          <button onClick={closeDetailView}>Close</button>
          <h2>{selectedGif.title} Detailed View</h2>
          <img 
          src={selectedGif.url} 
          alt={selectedGif.title} 
          height={400}
          />
        </div>
      ) : (
        <>
            <button onClick={handlePreviousPageClick} disabled={previousPageDisabled} >Previous Page</button>
            <button onClick={handleNextPageClick} disabled={nextPageDisabled} >Next Page</button>  
            <div className='container'>
                {
                    gifs.map((gif) => (
                    <div className='gif' key={gif.id} onClick={() => handleGifClick(gif)}>
                        <h3>{gif.title}</h3>
                        <img src={gif.url} alt={gif.title} />
                    </div>
                    ))  
                }
            </div>
        </>
      )}
     
    </div>
  );
};

export default GifPage;

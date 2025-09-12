import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Loader2, AlertCircle, CheckCircle, GamepadIcon, NewspaperIcon } from 'lucide-react';
import { useApi } from '../contexts/ApiContext';
import { 
  useGetAllGames, 
  useFetchNewsList, 
  useCreateProposal, 
  useGetOverviewData,
  useGameRating 
} from '../hooks/useApi';

export const ApiDemo: React.FC = () => {
  const api = useApi();
  
  // Game API hooks
  const { data: games, loading: gamesLoading, error: gamesError, execute: fetchGames } = useGetAllGames();
  const { data: createResult, loading: createLoading, error: createError, execute: createProposal } = useCreateProposal();
  const { data: ratingResult, loading: ratingLoading, error: ratingError, execute: submitRating } = useGameRating();
  
  // Web API hooks  
  const { data: newsList, loading: newsLoading, error: newsError, execute: fetchNews } = useFetchNewsList();
  const { data: overviewData, loading: overviewLoading, error: overviewError, execute: fetchOverview } = useGetOverviewData();

  // Form states
  const [proposalForm, setProposalForm] = useState({
    title: '',
    description: '',
    category: 'action'
  });

  const [ratingForm, setRatingForm] = useState({
    gameId: '',
    rating: 5,
    comment: ''
  });

  const [newsFilters, setNewsFilters] = useState({
    pageIndex: 1,
    pageSize: 10,
    type: ''
  });

  // Load initial data
  useEffect(() => {
    fetchGames();
    fetchNews(newsFilters);
    fetchOverview();
  }, []);

  const handleCreateProposal = async () => {
    if (!proposalForm.title.trim() || !proposalForm.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const result = await createProposal(proposalForm);
      if (result.isSuccess) {
        alert('Proposal created successfully!');
        setProposalForm({ title: '', description: '', category: 'action' });
        // Refresh games list if needed
        fetchGames();
      } else {
        alert('Failed to create proposal: ' + result.message);
      }
    } catch (error) {
      console.error('Create proposal error:', error);
    }
  };

  const handleRateGame = async () => {
    if (!ratingForm.gameId.trim()) {
      alert('Please enter a game ID');
      return;
    }

    try {
      const result = await submitRating({
        gameId: ratingForm.gameId,
        rating: ratingForm.rating,
        comment: ratingForm.comment
      });
      
      if (result.isSuccess) {
        alert('Rating submitted successfully!');
        setRatingForm({ gameId: '', rating: 5, comment: '' });
      } else {
        alert('Failed to submit rating: ' + result.message);
      }
    } catch (error) {
      console.error('Rating submission error:', error);
    }
  };

  const handleFetchNews = () => {
    fetchNews(newsFilters);
  };

  const StatusIndicator: React.FC<{ loading: boolean; error: string | null; success?: boolean }> = ({ loading, error, success }) => {
    if (loading) return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    if (error) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (success) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">


      {/* Overview Data */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GamepadIcon className="w-5 h-5" />
            Overview Data
          </h2>
          <div className="flex items-center gap-2">
            <StatusIndicator loading={overviewLoading} error={overviewError} />
            <Button 
              onClick={() => fetchOverview()} 
              disabled={overviewLoading}
              size="sm"
            >
              Refresh
            </Button>
          </div>
        </div>
        
        {overviewData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{overviewData.totalUsers || 'N/A'}</div>
              <div className="text-sm text-blue-600">Total Users</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{overviewData.totalTransactions || 'N/A'}</div>
              <div className="text-sm text-green-600">Transactions</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{overviewData.totalValue || 'N/A'}</div>
              <div className="text-sm text-purple-600">Total Value</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{overviewData.networkHealth || 'N/A'}%</div>
              <div className="text-sm text-orange-600">Network Health</div>
            </div>
          </div>
        )}
        
        {overviewError && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
            Error: {overviewError}
          </div>
        )}
      </Card>

      {/* Games List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GamepadIcon className="w-5 h-5" />
            Games List
          </h2>
          <div className="flex items-center gap-2">
            <StatusIndicator loading={gamesLoading} error={gamesError} success={games?.isSuccess} />
            <Button 
              onClick={() => fetchGames()} 
              disabled={gamesLoading}
              size="sm"
            >
              Refresh
            </Button>
          </div>
        </div>
        
        {games?.data && Array.isArray(games.data) ? (
          <div className="grid gap-4">
            {games.data.slice(0, 3).map((game: any, index: number) => (
              <div key={game.id || index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium">{game.title || `Game ${index + 1}`}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {game.description || 'No description available'}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    Category: {game.category || 'Unknown'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Rating: {game.rating || 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">
            No games data available
          </div>
        )}
        
        {gamesError && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
            Error: {gamesError}
          </div>
        )}
      </Card>

      {/* Create Proposal */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create Game Proposal</h2>
          <StatusIndicator loading={createLoading} error={createError} success={createResult?.isSuccess} />
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <Input
              value={proposalForm.title}
              onChange={(e) => setProposalForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter game title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Textarea
              value={proposalForm.description}
              onChange={(e) => setProposalForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your game proposal"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={proposalForm.category}
              onChange={(e) => setProposalForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="action">Action</option>
              <option value="strategy">Strategy</option>
              <option value="puzzle">Puzzle</option>
              <option value="rpg">RPG</option>
            </select>
          </div>
          
          <Button 
            onClick={handleCreateProposal}
            disabled={createLoading}
            className="w-full"
          >
            {createLoading ? 'Creating...' : 'Create Proposal'}
          </Button>
          
          {createError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              Error: {createError}
            </div>
          )}
          
          {createResult?.isSuccess && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded">
              Proposal created successfully!
            </div>
          )}
        </div>
      </Card>

      {/* Game Rating */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Rate Game</h2>
          <StatusIndicator loading={ratingLoading} error={ratingError} success={ratingResult?.isSuccess} />
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Game ID *
            </label>
            <Input
              value={ratingForm.gameId}
              onChange={(e) => setRatingForm(prev => ({ ...prev, gameId: e.target.value }))}
              placeholder="Enter game ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (1-5)
            </label>
            <select
              value={ratingForm.rating}
              onChange={(e) => setRatingForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {[1, 2, 3, 4, 5].map(rating => (
                <option key={rating} value={rating}>
                  {rating} Star{rating !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment (optional)
            </label>
            <Textarea
              value={ratingForm.comment}
              onChange={(e) => setRatingForm(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Leave a comment about the game"
              rows={2}
            />
          </div>
          
          <Button 
            onClick={handleRateGame}
            disabled={ratingLoading}
            className="w-full"
          >
            {ratingLoading ? 'Submitting...' : 'Submit Rating'}
          </Button>
          
          {ratingError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              Error: {ratingError}
            </div>
          )}
          
          {ratingResult?.isSuccess && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded">
              Rating submitted successfully!
            </div>
          )}
        </div>
      </Card>

      {/* News List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <NewspaperIcon className="w-5 h-5" />
            News List
          </h2>
          <div className="flex items-center gap-2">
            <StatusIndicator loading={newsLoading} error={newsError} success={newsList?.success} />
            <Button 
              onClick={handleFetchNews} 
              disabled={newsLoading}
              size="sm"
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <Input
            type="number"
            value={newsFilters.pageIndex}
            onChange={(e) => setNewsFilters(prev => ({ ...prev, pageIndex: parseInt(e.target.value) || 1 }))}
            placeholder="Page"
            className="w-20"
            min="1"
          />
          <Input
            value={newsFilters.type}
            onChange={(e) => setNewsFilters(prev => ({ ...prev, type: e.target.value }))}
            placeholder="Type filter"
            className="w-32"
          />
          <Button onClick={handleFetchNews} disabled={newsLoading}>
            Filter
          </Button>
        </div>
        
        {newsList?.data?.newsList && Array.isArray(newsList.data.newsList) ? (
          <div className="space-y-4">
            {newsList.data.newsList.slice(0, 3).map((article: any, index: number) => (
              <div key={article.id || index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium">{article.title || 'Untitled'}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {article.content || 'No content available'}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    Type: {article.type || 'Unknown'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'No date'}
                  </span>
                </div>
              </div>
            ))}
            <div className="text-sm text-gray-500 text-center">
              Total: {newsList.data.totalCount || 0} articles
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">
            No news articles available
          </div>
        )}
        
        {newsError && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
            Error: {newsError}
          </div>
        )}
      </Card>
    </div>
  );
};
import { Suspense, useMemo } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { navigationConfig } from './config/navigation';
import {
  Feedback,
  Suggest,
  ResourcePage
} from './pages/pages';
import { Header } from './components/Header/Header';
import { ThemeProvider } from './context/ThemeContext';
import { GlobalStyle } from '../src/styles/GlobalStyle';
import { Card } from './components/Card/Card';
import { CardsGrid } from './components/CardsGrid/CardsGrid';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
import { Suggestions } from './pages/Admin/Suggestions';
import { ApprovedList } from './pages/Admin/ApprovedList';
import { AuthProvider } from './context/AuthContext';
import { useState, useEffect } from 'react';
import { Resource, ResourcesBySection } from './types/resource';
import { Support } from './pages/Support/Support';
import { AdminFeedbackList } from './pages/Admin/FeedbackList';
import { ResourceSection } from './pages/ResourcePage/config';
import { Footer } from './components/Footer/Footer';
import { StartBanner } from './components/StartBanner/StartBanner';
import { Admin } from './pages/Admin/Admin';
import { GettingStarted } from './pages/GettingStarted/GettingStarted';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { Login } from './pages/Login/Login';
import { CategoryChips } from './components/CategoryChips/CategoryChips';
import { CATEGORIES, CategoryId } from './types/category';
import { CategoryChipsPanel } from './components/CategoryChipsPanel/CategoryChipsPanel';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: var(--background-color);
  display: flex;
  flex-direction: column;
`;

const MainContainer = styled.div`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding-top: calc(24px + 2rem);
  }
`;

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  padding: 0 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    margin: 1.5rem 0 2rem;
    padding: 0;
    align-items: flex-start;
  }
`;

const TitleContainer = styled.div`
  margin-top: -1rem;
  margin: 2rem 0 3rem;
  padding: 0 2rem;

  @media (max-width: 768px) {
    margin: 1.5rem 0 2rem;
    padding: 0;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: left;
  margin-bottom: 0.5rem;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  text-align: left;
  margin: 0;
  color: var(--text-secondary-color);
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ErrorMessage = styled.div`
  color: var(--error-color);
  text-align: center;
  padding: 2rem;
  background: var(--error-background, #fff1f0);
  border-radius: 8px;
  margin: 2rem 0;
`;

const CardsContainer = styled.section`
  padding: 0 2rem 3rem;

  @media (max-width: 768px) {
    padding: 0 0 3rem;
  }
`;

interface ApiResponse {
  items: Resource[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Обновляем конфигурацию страниц
const pageConfig = {
  articles: { path: '/articles', title: 'Статьи' },
  telegram: { path: '/telegram', title: 'Telegram-каналы' },
  podcasts: { path: '/podcasts', title: 'Подкасты' },
  courses: { path: '/courses', title: 'Курсы' },
  youtube: { path: '/youtube', title: 'YouTube-каналы' },
  books: { path: '/books', title: 'Книги' },
  resources: { path: '/resources', title: 'Ресурсы' },
};

function App() {
  const [resources, setResources] = useState<ResourcesBySection>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/approved?limit=100&page=1&status=approved');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Raw data from API:', data.items[0]);

        const grouped = data.items.reduce((acc: ResourcesBySection, item: any) => {
          const sectionKey = item.section.replace('/', '');
          
          if (!acc[sectionKey]) {
            acc[sectionKey] = [];
          }

          acc[sectionKey].push({
            id: item.id,
            url: item.url,
            section: sectionKey,
            description: item.description || '',
            createdAt: item.created_at,
            categories: item.categories || [],
            preview: {
              title: item.preview_title || '',
              description: item.preview_description || '',
              image: item.preview_image || '',
              favicon: item.preview_favicon || '',
              domain: item.preview_domain || ''
            }
          });

          return acc;
        }, {});

        console.log('Final grouped resources:', grouped);
        setResources(grouped);
        setError('');
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError('Не удалось загрузить ресурсы');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Фильтруем ресурсы по выбранным категориям
  const filteredResources = useMemo(() => {
    if (selectedCategories.length === 0) return resources;
    
    return Object.fromEntries(
      Object.entries(resources).map(([section, items]) => [
        section,
        items.filter(item => 
          item.categories?.some(cat => selectedCategories.includes(cat))
        )
      ])
    );
  }, [resources, selectedCategories]);

  return (
    <AuthProvider>
      <ThemeProvider>
        <GlobalStyle />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <PageContainer>
              <Header />
              <MainContainer>
                <main>
                  <Routes>
                    <Route path="/" element={
                      <>
                        <TitleSection>
                          <TitleContainer>
                            <Title>ALLY WIKI</Title>
                            <Subtitle>справочник цифровой доступности</Subtitle>
                          </TitleContainer>
                          <StartBanner />
                        </TitleSection>
                        <CategoryChipsPanel
                          selectedCategories={selectedCategories}
                          onChange={setSelectedCategories}
                        />
                        {loading ? (
                          <LoadingSpinner />
                        ) : error ? (
                          <ErrorMessage>{error}</ErrorMessage>
                        ) : (
                          <CardsContainer>
                            <CardsGrid>
                              {navigationConfig.map((item) => {
                                const sectionKey = item.path.replace('/', '');
                                return (
                                  <Card
                                    key={item.path}
                                    title={item.title}
                                    path={item.path}
                                    resources={filteredResources[sectionKey] || []}
                                  />
                                );
                              })}
                            </CardsGrid>
                          </CardsContainer>
                        )}
                      </>
                    } />
                    {Object.entries(pageConfig).map(([key, config]) => (
                      <Route 
                        key={config.path}
                        path={config.path}
                        element={
                          <ResourcePage 
                            section={key as ResourceSection}
                          />
                        }
                      />
                    ))}
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/suggest" element={<Suggest />} />
                    <Route 
                      path="/admin/suggestions" 
                      element={
                        <ProtectedRoute showError>
                          <Suggestions />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/approved" 
                      element={
                        <ProtectedRoute>
                          <ApprovedList />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/support" element={<Support />} />
                    <Route path="/admin/feedback-list" element={<AdminFeedbackList />} />
                    <Route path="/login" element={<Login />} />
                    <Route 
                      path="/admin/*" 
                      element={
                        <ProtectedRoute>
                          <Admin />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/getting-started" element={<GettingStarted />} />
                  </Routes>
                </main>
              </MainContainer>
              <Footer />
            </PageContainer>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

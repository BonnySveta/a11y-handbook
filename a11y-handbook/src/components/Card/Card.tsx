import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaCode, FaPalette, FaUserTie, FaCheckSquare, FaTelegram, FaPodcast, FaGraduationCap, FaYoutube, FaBook, FaNewspaper, FaCalendarAlt } from 'react-icons/fa';
import { Tag } from '../Tag/Tag';
import { TagType, TAGS } from '../../types/tags';

const CardWrapper = styled.div`
  background: var(--card-background, var(--nav-background));
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CardTitle = styled.h2`
  color: var(--text-color);
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
`;

const CardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CardListItem = styled.li`
  margin-bottom: 0.5rem;
`;

const CardLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem;
  display: block;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--nav-hover-background);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  font-size: 1.5rem;
  color: var(--accent-color);
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const Counter = styled.span`
  color: var(--text-secondary-color);
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const NewBadge = styled.span`
  background-color: var(--accent-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

const AnimatedCardWrapper = styled(CardWrapper)<{ $delay: number }>`
  animation: fadeInUp 0.5s ease forwards;
  animation-delay: ${({ $delay }) => $delay}ms;
  opacity: 0;
`;

interface CardProps {
  title: string;
  path: string;
  children?: { title: string; path: string; isNew?: boolean; }[];
  icon?: string;
  isNew?: boolean;
  tags?: TagType[];
}

const getIcon = (path: string) => {
  switch (path) {
    case '/articles': return <FaNewspaper />;
    case '/articles/dev': return <FaCode />;
    case '/articles/design': return <FaPalette />;
    case '/articles/management': return <FaUserTie />;
    case '/articles/qa': return <FaCheckSquare />;
    case '/events': return <FaCalendarAlt />;
    case '/telegram': return <FaTelegram />;
    case '/podcasts': return <FaPodcast />;
    case 'https://inclusivepineapple.github.io/': return <FaPodcast />;
    case '/courses': return <FaGraduationCap />;
    case '/youtube': return <FaYoutube />;
    case '/books': return <FaBook />;
    default: return null;
  }
};

export const Card: React.FC<CardProps> = ({ title, path, children, isNew, tags }) => {
  const icon = getIcon(path);
  const itemCount = children?.length || 0;

  return (
    <AnimatedCardWrapper $delay={Math.random() * 300}>
      <CardHeader>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        <CardTitle>
          <CardLink to={path}>
            {title}
            {isNew && <NewBadge>New</NewBadge>}
          </CardLink>
        </CardTitle>
      </CardHeader>
      {tags && tags.length > 0 && (
        <TagsContainer>
          {tags.map(tagId => (
            <Tag key={tagId} tag={TAGS[tagId]} />
          ))}
        </TagsContainer>
      )}
      {children && children.length > 0 && (
        <>
          <CardList>
            {children.map((child) => (
              <CardListItem key={child.path}>
                <CardLink to={child.path}>
                  {child.title}
                  {child.isNew && <NewBadge>New</NewBadge>}
                </CardLink>
              </CardListItem>
            ))}
          </CardList>
          <CardMeta>
            <Counter>
              <FaBook /> {itemCount} {itemCount === 1 ? 'материал' : 'материалов'}
            </Counter>
          </CardMeta>
        </>
      )}
    </AnimatedCardWrapper>
  );
}; 
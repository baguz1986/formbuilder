# Copilot Instructions for Form Builder Application

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a form builder application similar to JotForm built with Next.js, TypeScript, and Tailwind CSS.

## Project Structure
- `/src/app` - Next.js App Router pages and layouts
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and configurations
- `/src/types` - TypeScript type definitions

## Key Features
1. **Drag & Drop Form Builder**: Interactive form creation interface
2. **Form Components**: Various input types (text, email, select, checkbox, etc.)
3. **Form Renderer**: Display forms based on schema
4. **Form Management**: Create, edit, delete, and share forms
5. **Response Collection**: Store and manage form submissions
6. **Analytics Dashboard**: View form statistics and responses

## Technologies Used
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- React DnD for drag and drop functionality
- Prisma for database management
- NextAuth.js for authentication

## Code Style Guidelines
- Use TypeScript for all components and utilities
- Follow React best practices with hooks and functional components
- Use Tailwind CSS classes for styling
- Implement proper error handling and loading states
- Create reusable components for form elements
- Use proper TypeScript interfaces for form schemas

## Form Schema Structure
Forms should follow a JSON schema structure with:
- Form metadata (title, description, settings)
- Field definitions (type, label, validation, options)
- Styling and layout configurations

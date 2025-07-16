# Advanced JSON Merger

A modern, responsive web application built with Next.js 15 and TypeScript that allows users to transform JSON files with configurable field mappings.

## ✨ Features

- **Multi-step Workflow**: Upload → Select Fields → Configure Mappings → Process → Download
- **Flexible Field Mapping**: Configure how each field maps between entries and assets
- **Batch Processing**: Handle multiple field transformations in a single operation
- **Smart Defaults**: Automatic field name suggestions (e.g., `imageId` → `image`)
- **Modern UI**: Clean, responsive interface with sticky navigation and improved spacing
- **Real-time Validation**: Input validation with helpful error messages
- **Statistics Dashboard**: Detailed statistics about matches and transformations
- **Download Export**: Export processed JSON with proper formatting and download icon
- **Text Overflow Handling**: Proper truncation for long field names with tooltips

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended package manager)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cjson
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3003](http://localhost:3003) in your browser

## 📖 How to Use

### 1. Upload JSON Files

Upload two JSON files:
- **entries.json**: Main data with fields that need transformation
- **assets.json**: Reference data containing replacement values

### 2. Select Fields to Transform

Choose which fields from entries.json should be replaced with data from assets.json.

### 3. Configure Field Mappings

For each selected field, define:
- **New Field Name**: What the field should be called after transformation
- **Match Key**: Which field in assets.json to match against
- **Replace With**: Which field value from assets.json to use as replacement
- **Remove Original**: Whether to remove the original field (disabled by default)

### 4. Process & Download

Review the transformation results and download the processed JSON file.

## 💡 Example Usage

**Input Files:**

`entries.json`:
```json
[
  { "title": "Post 1", "imageId": "a1", "bannerImageId": "b2", "content": "..." },
  { "title": "Post 2", "imageId": "x9", "bannerImageId": "b2", "content": "..." }
]
```

`assets.json`:
```json
[
  { "id": "a1", "filename": "cat.jpg", "uid": "u1" },
  { "id": "b2", "filename": "dog.jpg", "uid": "u2" }
]
```

**Configuration:**
- Fields to transform: `imageId`, `bannerImageId`
- Match key: `id`
- Replace with: `filename`
- New field names: `image`, `bannerImage`

**Output:**
```json
[
  { "title": "Post 1", "image": "cat.jpg", "bannerImage": "dog.jpg", "content": "..." },
  { "title": "Post 2", "image": null, "bannerImage": "dog.jpg", "content": "..." }
]
```

## 🧩 Component Architecture

- **JsonUploader**: Handles file upload with drag-and-drop support
- **FieldSelector**: Interactive field selection with checkboxes
- **MappingConfigurator**: Advanced mapping configuration interface
- **JsonReplacer**: Core transformation logic with lookup maps
- **JsonViewer**: Pretty-printed JSON display with statistics
- **DownloadButton**: File export functionality

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: useReducer for complex state
- **Build Tool**: Turbopack for fast development

## 📁 Sample Files

Test the application with the included sample files:
- `/public/advanced-entries.json` - Sample blog posts with multiple image references
- `/public/advanced-assets.json` - Sample asset data with filenames and metadata

## 🔧 Development

### Build for Production
```bash
pnpm build
```

### Linting
```bash
pnpm lint
```

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

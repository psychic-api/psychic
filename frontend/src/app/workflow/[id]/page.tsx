"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  useOnSelectionChange,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type NodeTypes,
} from '@xyflow/react';
import * as SubframeCore from "@subframe/core";
import { WorkflowPageLayout } from "@/subframe/layouts/WorkflowPageLayout";
import { IconWithBackground, IconName } from "@/subframe/components/IconWithBackground";
import { RadioGroup } from "@/subframe/components/RadioGroup";
import { Button } from "@/subframe/components/Button";
import { Table } from "@/subframe/components/Table";
import { Select } from "@/subframe/components/Select";
import { PropertiesAccordion } from "@/subframe/components/PropertiesAccordion";
import { TextArea } from "@/subframe/components/TextArea";
import { Alert } from "@/subframe/components/Alert";
import { PropertiesRow } from "@/subframe/components/PropertiesRow";
import { Switch } from "@/subframe/components/Switch";

import '@xyflow/react/dist/style.css';
import { FinicNodeType, NodeIcons } from "@/types";
import { SourceNode, DestinationNode, MappingNode, JoinNode, SplitNode, FilterNode, ConditionalNode, GenerativeAINode, PythonNode, SQLNode } from "@/components/nodes";
import { ConfigurationDrawer } from "@/components/ConfigurationDrawer";

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { title: 'Example Source Node', description: 'Test Description' } , type: 'source' },
  { id: '2', position: { x: 500, y: 0 }, data: { title: 'Example Source Node', description: 'Test Description' }, type:'destination' },
  { id: '3', position: { x: 1000, y: 0 }, data: { title: 'Example Source Node', description: 'Test Description' }, type:'mapping' },
  { id: '4', position: { x: 1500, y: 0 }, data: { title: 'Example Source Node', description: 'Test Description' }, type:'join' },
  { id: '5', position: { x: 2000, y: 0 }, data: { title: 'Example Source Node', description: 'Test Description' }, type:'split' },
  { id: '6', position: { x: 2500, y: 0 }, data: { title: 'Example Source Node', description: 'Test Description' }, type:'filter' },
  { id: '7', position: { x: 3000, y: 0 }, data: { title: 'Example Source Node', description: 'Test Description' }, type:'conditional' },
  { id: '8', position: { x: 3500, y: 0 }, data: { title: 'Example Source Node', description: 'Test Description' }, type:'generative_ai' },
  { id: '9', position: { x: 4000, y: 0 }, data: { title: 'Example Source Node', description: 'Test Description' }, type:'python' },
  { id: '10', position: { x: 4500, y: 0 }, data: { title: 'Example Source Node', description: 'Test Description' }, type:'sql' },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const nodeTypes: NodeTypes = {
  source: SourceNode,
  destination: DestinationNode,
  mapping: MappingNode,
  join: JoinNode,
  split: SplitNode,
  filter: FilterNode,
  conditional: ConditionalNode,
  generative_ai: GenerativeAINode,
  python: PythonNode,
  sql: SQLNode,
};

export default function WorkflowPage() {
  // const [nodes] = useState<Node[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const nodesWithData = initialNodes.map((node) => {return {...node, data: {...node.data, openDrawer: () => setIsDrawerOpen(true)}}});

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesWithData);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  const onConnect = useCallback(
    (params: any) => setEdges((edges) => addEdge(params, edges)),
    [setEdges],
  )

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      setSelectedEdge(null);
      setIsDrawerOpen(true);
    },
    [setSelectedNode, setSelectedEdge, setIsDrawerOpen],
  );

  function RenderWorkflow() {
    return (
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    );
  }

  function addNode(nodeType: FinicNodeType) {
    console.log('add node');
    const newNode = {
      id: (nodes.length + 1).toString(),
      position: { x: 0, y: 500 },
      data: { label: (nodes.length + 1).toString() },
      type: nodeType,
    };
    setNodes([...nodes, newNode]);
  }

  function closeDrawer() {
    setSelectedEdge(null);
    setSelectedNode(null);
    setIsDrawerOpen(false);
  }

  return (
    <WorkflowPageLayout addNode={addNode}>
      <div className="flex h-full w-full flex-col items-start bg-default-background">
        <div className="flex w-full h-full flex-wrap items-start mobile:flex-col mobile:flex-wrap mobile:gap-0">
          <div className="flex grow shrink-0 basis-0 flex-col items-center justify-center gap-2 self-stretch bg-neutral-50 mobile:border mobile:border-solid mobile:border-neutral-border mobile:pt-12 mobile:pr-12 mobile:pb-12 mobile:pl-12">
            {nodes.length > 0 ? RenderWorkflow() : <div className="flex flex-col items-center justify-center gap-4">
                  <SubframeCore.Icon
                    className="text-heading-3 font-heading-3 text-subtext-color"
                    name="FeatherPlay"
                  />
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="text-caption-bold font-caption-bold text-default-font">
                    Create your first workflow
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    Drag-and-drop a node to start
                  </span>
                </div>
              </div>
            }
          </div>
          {selectedNode && <ConfigurationDrawer 
            className={isDrawerOpen ? undefined : 'hidden'}
            closeDrawer={closeDrawer}
            title={selectedNode.data.title as string}
            description={selectedNode.data.description as string}
            nodeType={selectedNode.type as string}
            iconName={NodeIcons[selectedNode.type as keyof IconName]}
          >
          </ConfigurationDrawer>}
        </div>
      </div>
    </WorkflowPageLayout>
  );
}